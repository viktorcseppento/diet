export async function getLastSync() {
    return await db.meta.where('key').equals('lastSync').first() ?? 0;
}

export async function setLastSync(timestamp) {
    await db.meta.put({ key: 'lastSync', value: timestamp });
}