import Dexie from 'dexie';
import { db } from './db';

export async function getPeople() {
    return await db.people.where('[deleted+createdAt]').between([0, Dexie.minKey], [0, Dexie.maxKey]).toArray();
}

export async function addPerson(person) {
    return await db.people.add({
        ...person,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        lastUpdated: Date.now(),
        deleted: 0
    });
}

export async function editPerson(id, person) {
    return await db.people.update(id, { name: person.name, lastUpdated: Date.now() });
}

export async function removePerson(id) {
    return await db.people.update(id, { deleted: 1, lastUpdated: Date.now() });
}