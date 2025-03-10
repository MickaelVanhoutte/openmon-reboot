import Dexie, { type EntityTable, type Observable } from 'dexie';
import { liveQuery } from 'dexie';
import type { GameData } from './game/data.model';

// TODO move to a separate file
export interface Save {
  id?: number;
  created: number;
  updated: number;
}

const db = new Dexie('data') as Dexie & {
  gameData: EntityTable<
    GameData,
    'id' // primary key "id" (for the typings only)
  >;
  saves: EntityTable<
    Save,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  gameData: '++id, options, pokedex, maps', // primary key "id" (for the runtime!)
  saves: '++id, created, updated', // primary key "id" (for
});

export { db };

//  Game data

export async function createData(data: GameData): Promise<number | undefined> {
  try {
    const id = await db.gameData.add(data);
    return id;
  } catch (error) {
    if (error?.toString()?.includes('Key already exists')) {
      updateData(data);
      return Promise.resolve(data.id);
    } else {
      console.log(`Failed to add data: ${error}`);
    }
  }
}

export function getDataById(id: number): Observable<GameData | undefined> {
  return liveQuery(() => db.gameData.get(id));
}

export function getData(): Observable<GameData[]> {
  return liveQuery(() => db.gameData.toArray());
}

export function updateData(data: GameData) {
  db.gameData.put(data);
}

export function deleteData(id: number) {
  db.gameData.delete(id);
}

// Save

export async function createSave(save: Save): Promise<number> {
  try {
    const id = await db.saves.add(save);
    return id || -1;
  } catch (error) {
    if (error?.toString()?.includes('Key already exists')) {
      updateSave(save);
      return Promise.resolve(save.id || -1);
    } else {
      console.log(`Failed to add data: ${error}`);
      return -1;
    }
  }
}

export function getSaveById(id: number): Observable<Save | undefined> {
  return liveQuery(() => db.saves.get(id));
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
