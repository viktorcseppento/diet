import { db } from "./db";

export async function addSyncRecord(tx, recordId, table, data) {
    let existing = await tx.syncQueue.get({ recordId });
    if (existing) {
        await tx.syncQueue.delete(existing.id);
    }
    tx.syncQueue.add({
        recordId,
        table,
        data,
        createdAt: Date.now()
    });
}

export async function getSyncQueue() {
    return await db.syncQueue.toArray();
}

export async function clearSyncQueue() {
    await db.syncQueue.clear();
}

export async function putData(foods, meals, people, timestamp) {
    await db.transaction('rw', db.foods, db.meals, db.people, db.meta, async (tx) => {
        await tx.foods.bulkPut(foods);
        await tx.meals.bulkPut(meals);
        await tx.people.bulkPut(people);
        await tx.meta.put({ key: 'lastSync', value: timestamp });
    });
}