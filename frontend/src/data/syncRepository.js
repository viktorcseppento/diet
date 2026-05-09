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