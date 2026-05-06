import { db } from './db';

export async function getMealsByPerson(personId) {
    if (!personId)
        return [];
    return await db.meals.where('personId').equals(personId).toArray();
}

export async function getMealDatesByPerson(personId) {
    const meals = await db.meals.where('personId').equals(personId).toArray();
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
    return await db.meals.add({
        personId: meal.personId,
        date: meal.date,
        foods: meal.foods,
        comment: meal.comment,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        lastUpdated: Date.now()
    });
}

export async function editMeal(id, meal) {
    return await db.meals.update(id, {
        date: meal.date,
        foods: meal.foods,
        comment: meal.comment,
        lastUpdated: Date.now()
    });
}

export async function removeMeal(id) {
    return await db.meals.delete(id);
}