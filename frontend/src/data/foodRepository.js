import Dexie from 'dexie';
import { db } from './db';

export async function getFoods() {
    return await db.foods.where('[deleted+lastUpdated]').between([0, Dexie.minKey], [0, Dexie.maxKey]).reverse().toArray();
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
    return await db.foods.add({
        ...food,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        lastUpdated: Date.now(),
        deleted: 0
    });
}

export async function editFood(id, food) {
    return await db.transaction('rw', db.foods, async () => {
        await db.foods.update(id, { deleted: 1, lastUpdated: Date.now() });
        await db.foods.add({
            ...food,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            lastUpdated: Date.now(),
            deleted: 0
        });
    });
}

export async function removeFood(id) {
    return await db.foods.update(id, { deleted: 1, lastUpdated: Date.now() });
}