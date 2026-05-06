export async function getSettings() {
    return await db.settings.get("app");
}

export async function initSettings() {
    const existing = await db.settings.get("app");

    if (!existing) {
        await db.settings.put({
            id: "app",
            serverUrl: ""
        });
    }
}

export async function updateSettings(settings) {
    return await db.settings.put({
        ...settings,
        id: "app"
    });
}