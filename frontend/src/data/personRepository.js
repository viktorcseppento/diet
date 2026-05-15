import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { addSyncRecord } from './syncRepository';

export async function getPeople() {
    return await db.people.where('[deleted+createdAt]').between([0, Dexie.minKey], [0, Dexie.maxKey]).toArray();
}

export async function addPerson(person) {
    const timestamp = Date.now();
    const newPerson = {
        ...person,
        id: uuidv4(),
        createdAt: timestamp,
        lastUpdated: timestamp,
        deleted: 0
    };
    await db.transaction('rw', db.people, db.syncQueue, async (tx) => {
        await db.people.add(newPerson);
        await addSyncRecord(tx, newPerson.id, 'people', newPerson);
    });
}

export async function editPerson(id, person) {
    await db.transaction('rw', db.people, db.syncQueue, async (tx) => {
        await db.people.update(id, {
            name: person.name,
            targets: person.targets,
            lastUpdated: Date.now()
        });
        const updatedPerson = await db.people.get(id);
        await addSyncRecord(tx, updatedPerson.id, 'people', updatedPerson);
    });
}

export async function removePerson(id) {
    await db.transaction('rw', db.people, db.syncQueue, async (tx) => {
        await db.people.update(id, { deleted: 1, lastUpdated: Date.now() });
        const person = await db.people.get(id);
        await addSyncRecord(tx, person.id, 'people', person)
    })
}