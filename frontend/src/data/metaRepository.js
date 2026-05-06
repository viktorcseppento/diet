export async function getLastSync() {
    return await db.meta.where('key').equals('lastSync').first();
}
