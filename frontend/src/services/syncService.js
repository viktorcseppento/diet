import { getLastSync } from "../data/metaRepository";
import { getSettings } from "../data/settingsRepository";
import { clearSyncQueue, getSyncQueue, putData } from "../data/syncRepository";

async function getServerUrl() {
    return (await getSettings()).serverUrl;
}

export async function getSync() {
    return (await getSettings()).sync;
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

    if (!response.ok) {
        throw new Error(`HTTP status - ${response.status}`);
    }

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
        await apiRequest(`${serverUrl}/api/${API_VERSION}/sync/push`, "POST", pushData);
        await clearSyncQueue();
        const timestamp = await getLastSync();
        const pullData = await apiRequest(`${serverUrl}/api/${API_VERSION}/sync/pull?since=${timestamp}`);

        const foodDeleteIds = pullData.tombstones.filter(t => t.table === "foods").map(t => t.recordId);
        const mealDeleteIds = pullData.tombstones.filter(t => t.table === "meals").map(t => t.recordId);
        const peopleDeleteIds = pullData.tombstones.filter(t => t.table === "people").map(t => t.recordId);
        await putData(pullData.foods, pullData.meals, pullData.people,
            foodDeleteIds, mealDeleteIds, peopleDeleteIds, pullData.timestamp);
        return true;
    } catch (error) {
        console.warn("Error during sync:", error);
        return false;
    } finally {
        syncing = false;
    }
}