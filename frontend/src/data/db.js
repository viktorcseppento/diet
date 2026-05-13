import Dexie from "dexie";

export const db = new Dexie('diet-db');

db.version(1).stores({
    // id: UUID, name: string, targets: {[ name, key, rule, value ]}
    // createdAt: timestamp, lastUpdated: timestamp, deleted: number
    people: 'id, name, createdAt, lastUpdated, deleted, [deleted+createdAt]',
    // id: UUID, name: string, type: FOOD_TYPES, measure: MEASURE_UNITS, ingredients: [{ foodId, foodName, amount }], amount: number
    // macros { fat, fatSaturated, fastCarbohydrate, slowCarbohydrate, fiber, protein }
    // allergens { addedSugar, dairy, egg, gluten }
    // deleted: number, createdAt: timestamp, lastUpdated: timestamp
    foods: 'id, name, type, deleted, createdAt, lastUpdated, [deleted+lastUpdated], [deleted+createdAt]',
    // id: UUID, personId: UUID, date: timestamp, comment: string, foods: [{ foodId, amount }]
    // createdAt: timestamp, lastUpdated: timestamp, deleted: number
    meals: 'id, personId, date, createdAt, lastUpdated, deleted, [deleted+personId]',
    // id: increment, recordId: UUID, table: string, data: any, createdAt: timestamp
    syncQueue: '++id, recordId, table, createdAt',
    // id: increment, key: string (e.g lastSync), value: any
    meta: '++id, key',
    // id: 'app', stores only the settings object
    settings: 'id'
});

db.version(2).upgrade(async tx => {
    const foodsArray = await tx.table('foods').toArray();
    const foodMap = new Map(foodsArray.map(f => [f.id, f]));
    const toUpdateFoods = [];
    const syncQueue = [];
    foodsArray.forEach(food => {
        let changed = false;
        if (!food.allergens) {
            food.allergens = {
                addedSugar: false,
                dairy: false,
                egg: false,
                gluten: false
            };
            changed = true;
        }
        food.ingredients?.map(i => {
            if (!i.foodName) {
                const food = foodMap.get(i.foodId);
                i.foodName = food.name;
                changed = true;
            }
        });
        if (changed) {
            food.lastUpdated = Date.now();
            toUpdateFoods.push(food);
            syncQueue.push({
                recordId: food.id,
                table: 'foods',
                createdAt: Date.now(),
                data: food
            });
        }
    });
    await tx.table('foods').bulkPut(toUpdateFoods);

    const peopleArray = await tx.table('people').toArray();
    const toUpdatePeople = [];
    peopleArray.forEach(person => {
        if (!person.targets) {
            person.targets = [];
            person.lastUpdated = Date.now();
            toUpdatePeople.push(person);
            syncQueue.push({
                recordId: person.id,
                table: 'people',
                createdAt: Date.now(),
                data: person
            });
        }
    });
    await tx.table('people').bulkPut(toUpdatePeople);
    await tx.table('syncQueue').bulkPut(syncQueue);
})

const lastSyncRecord = await db.meta.get({ key: 'lastSync' });
if (!lastSyncRecord) {
    await db.meta.add({ key: 'lastSync', value: 0 });
}

const settingsRecord = await db.settings.get({ id: 'app' });
if (!settingsRecord) {
    await db.settings.add({ id: 'app', serverUrl: "", sync: 0 });
}