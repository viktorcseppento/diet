import { getLastSync } from "../data/metaRepository";
import { getSettings } from "../data/settingsRepository";
import { clearSyncQueue, getSyncQueue, putData } from "../data/syncRepository";

async function getServerUrl() {
    return (await getSettings()).serverUrl;
}

function pushDataFromQueue(queue) {
    const foods = [];
    const meals = [];
    const people = [];
    for (const item of queue) {
        if (item.table === "foods") {
            foods.push(item.data);
        } else if (item.table === "meals") {
            meals.push(item.data);
        } else if (item.table === "people") {
            people.push(item.data);
        }
    }
    return { foods, meals, people };
}

const API_VERSION = "v1";

async function apiRequest(path, method = "GET", body) {
    const response = await fetch(path, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined
    });

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

export async function checkServerConnection() {
    try {
        const serverUrl = await getServerUrl();
        await apiRequest(`${serverUrl}/health`);
        return true;
    } catch (error) {
        console.warn("Cannot connect to server:", error);
        return false;
    }
}

let syncing = false;
export async function sync() {
    try {
        if (syncing) {
            return;
        }
        syncing = true;
        const serverUrl = await getServerUrl();
        const syncQueue = await getSyncQueue();
        const pushData = pushDataFromQueue(syncQueue);
        await apiRequest(`${serverUrl}/api/${API_VERSION}/push`, "POST", pushData);
        await clearSyncQueue();
        const timestamp = getLastSync() || 0;
        const pullData = await apiRequest(`${serverUrl}/api/${API_VERSION}/pull?since=${timestamp}`);
        await putData(pullData.foods, pullData.meals, pullData.people, pullData.timestamp);
    } catch (error) {
        console.warn("Error during sync:", error);
    } finally {
        syncing = false;
    }
}