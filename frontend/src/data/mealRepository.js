import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { addSyncRecord } from './syncRepository';

export async function getMealsByPerson(personId) {
    if (!personId)
        return [];
    return await db.meals.where('[deleted+personId]').equals([0, personId]).toArray();
}

export async function getMealsByPersonAndDay(personId, day) {
    if (!personId || !day)
        return [];
    const rangeStart = new Date(day.year, day.month, day.day).getTime();
    const rangeEnd = new Date(day.year, day.month, day.day + 1).getTime();

    return await db.meals.where('[deleted+personId]').equals([0, personId]).and(meal => {
        const mealTime = new Date(meal.date).getTime();
        return mealTime >= rangeStart && mealTime < rangeEnd;
    }).toArray();
}

export async function getMealDatesByPerson(personId) {
    if (personId == null)
        return [];
    const meals = await db.meals.where('[deleted+personId]').equals([0, personId]).toArray();
    const dates = [...new Set(meals.map(meal => {
        const date = new Date(meal.date);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }))];

    return dates.map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return { year, month, day };
    });
}

export async function getFoodsByMeal(mealId) {
    if (!mealId)
        return [];
    const meal = await db.meals.get(mealId);

    const foodIds = meal.foods.map(i => i.foodId);
    const foods = await db.foods.bulkGet(foodIds);

    return foods.map((food, idx) => ({
        food: food,
        amount: meal.foods[idx].amount
    }));
}

export async function addMeal(meal) {
    const timestamp = Date.now();
    const newMeal = {
        personId: meal.personId,
        date: meal.date,
        foods: meal.foods,
        comment: meal.comment,
        id: uuidv4(),
        createdAt: timestamp,
        lastUpdated: timestamp,
        deleted: 0
    };
    await db.transaction('rw', db.meals, db.syncQueue, async (tx) => {
        await db.meals.add(newMeal);
        await addSyncRecord(tx, newMeal.id, 'meals', newMeal);
    });
}

export async function editMeal(id, meal) {
    const timestamp = Date.now();
    await db.transaction('rw', db.meals, db.syncQueue, async (tx) => {
        await db.meals.update(id, {
            date: meal.date,
            foods: meal.foods,
            comment: meal.comment,
            lastUpdated: timestamp
        });
        const updatedMeal = await db.meals.get(id);
        await addSyncRecord(tx, updatedMeal.id, 'meals', updatedMeal);
    });
}

export async function removeMeal(id) {
    await db.transaction('rw', db.meals, db.syncQueue, async (tx) => {
        await db.meals.update(id, { deleted: 1, lastUpdated: Date.now() });
        const meal = await db.meals.get(id);
        await addSyncRecord(tx, meal.id, 'meals', meal)
    });
}