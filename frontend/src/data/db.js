import Dexie from "dexie";

export const db = new Dexie('diet-db');

db.version(1).stores({
    // id: UUID, name: string, createdAt: timestamp, lastUpdated: timestamp, deleted: number
    people: 'id, name, createdAt, lastUpdated, deleted, [deleted+createdAt]',
    // id: UUID, name: string, type: FOOD_TYPES, measure: MEASURE_UNITS, ingredients: [{ foodId, amount }], amount: number
    // macros { fat, fatSaturated, fastCarbohydrates, slowCarbohydrates, fiber, protein }
    // deleted: number, createdAt: timestamp, lastUpdated: timestamp
    foods: 'id, name, type, deleted, createdAt, lastUpdated, [deleted+lastUpdated]',
    // id: UUID, personId: UUID, date: timestamp, comment: string, foods: [{ foodId, amount }], createdAt: timestamp, lastUpdated: timestamp
    meals: 'id, personId, date, createdAt, lastUpdated',
    // id: increment, operation: enum, recordId: UUID, data: any, createdAt: timestamp
    syncQueue: '++id, operation, recordId, createdAt',
    // id: increment, key: string (e.g lastSync), value: any
    meta: '++id, key',
    // id: 'app', stores only the settings object
    settings: 'id'
});
