import Dexie, { type EntityTable, type Observable } from 'dexie';
import { liveQuery } from 'dexie';

interface Save {
  id?: number;
  created: number;
  updated: number;
}

const db = new Dexie('Save') as Dexie & {
  saves: EntityTable<
    Save,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  saves: '++id, created, updated', // primary key "id" (for the runtime!)
});

export type { Save };
export { db };

export async function createSave(save: Save) {
  try {
    const id = await db.saves.add(save);

    console.log(`Save successfully added. Got id ${id}`);
  } catch (error) {
    console.log(`Failed to add save: ${error}`);
  }
}

export function getSaves(): Observable<Save[]> {
  return liveQuery(() => db.saves.toArray());
}

export function updateSave(save: Save) {
  db.saves.put(save);
}

export function deleteSave(id: number) {
  db.saves.delete(id);
}
