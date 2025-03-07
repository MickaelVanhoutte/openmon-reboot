import Dexie, { type EntityTable, type Observable } from 'dexie';
import { liveQuery } from 'dexie';
import type { GameData } from './game/data.model';

// interface Save {
//   id?: number;
//   created: number;
//   updated: number;
// }

const db = new Dexie('data') as Dexie & {
  gameData: EntityTable<
    GameData,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  gameData: '++id, pokedex, maps', // primary key "id" (for the runtime!)
});

export { db };

export async function createData(data: GameData): Promise<number | undefined>{
  try {
    const id = await db.gameData.add(data);
    return id;
  } catch (error) {
    if(error?.toString()?.includes('Key already exists')) {
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

