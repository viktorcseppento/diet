import { checkServerConnection, getSync, sync } from "./syncService";

let intervalId;

export function startSyncScheduler() {
    syncIfOnline();

    window.addEventListener("online", () => {
        syncIfOnline();
    });

    intervalId = window.setInterval(() => {
        syncIfOnline();
    }, 5 * 60 * 1000);
}

async function syncIfOnline() {
    if (!navigator.onLine) {
        return;
    }
    if (!await getSync()) {
        return;
    }
    if (await checkServerConnection()) {
        await sync();
    }
}