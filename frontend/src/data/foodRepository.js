import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { addSyncRecord } from './syncRepository';

export async function getFoods() {
    return await db.foods.where('[deleted+createdAt]').between([0, Dexie.minKey], [0, Dexie.maxKey]).reverse().toArray();
}

export async function getAllFoods() {
    return await db.foods.toArray();
}

export async function getIngredients(id) {
    if (!id)
        return [];
    const food = await db.foods.get(id);

    if (food.type !== 'COMPOSITE')
        return [];

    const ingredientIds = food.ingredients.map(i => i.foodId);
    const ingredients = await db.foods.bulkGet(ingredientIds);

    return ingredients.map((ingredient, idx) => ({
        food: ingredient,
        amount: food.ingredients[idx].amount
    }));
}

export async function addFood(food) {
    const timestamp = Date.now();
    const newFood = {
        ...food,
        id: uuidv4(),
        createdAt: timestamp,
        lastUpdated: timestamp,
        deleted: 0
    };
    await db.transaction('rw', db.foods, db.syncQueue, async (tx) => {
        await db.foods.add(newFood);
        await addSyncRecord(tx, newFood.id, 'foods', newFood);
    });
}

export async function editFood(id, food) {
    const timestamp = Date.now();
    const newFood = {
        ...food,
        id: uuidv4(),
        createdAt: timestamp,
        lastUpdated: timestamp,
        deleted: 0
    };
    await db.transaction('rw', db.foods, db.syncQueue, async (tx) => {
        await db.foods.update(id, { deleted: 1, lastUpdated: timestamp });
        const oldFood = await db.foods.get(id);
        await addSyncRecord(tx, oldFood.id, 'foods', oldFood)
        await db.foods.add(newFood);
        await addSyncRecord(tx, newFood.id, 'foods', newFood)
    });
}

export async function removeFood(id) {
    await db.transaction('rw', db.foods, db.syncQueue, async (tx) => {
        await db.foods.update(id, { deleted: 1, lastUpdated: Date.now() });
        const food = await db.foods.get(id);
        await addSyncRecord(tx, food.id, 'foods', food)
    });
}