import { db } from "./db";

export async function getLastSync() {
    return (await db.meta.where('key').equals('lastSync').first()).value ?? 0;
}

export async function setLastSync(timestamp) {
    const lastSyncRecord = await db.meta.get({ key: 'lastSync' });
    await db.meta.update(lastSyncRecord.id, { value: timestamp });
}

export async function clearData() {
    await db.transaction('rw', db.foods, db.meals, db.people, db.syncQueue, db.meta, async () => {
        await db.foods.clear();
        await db.meals.clear();
        await db.people.clear();
        await db.syncQueue.clear();
        const lastSyncRecord = await db.meta.get({ key: 'lastSync' });
        await db.meta.update(lastSyncRecord.id, { value: 0 });
    });
}