import type { FullDexEntry } from '$lib/pokedex/fulldex';
import type { Map } from '$lib/maps/map.model';

export interface GameData {
  id?: number;
  options: GameOptions;
  pokedex: FullDexEntry[];
  maps: Map[];
}

export interface GameOptions {
  name: string;
  gDriveSync: boolean;

  difficulty: 0 | 1 | 2;
  shinyRate: 0 | 1 | 2 | 3 | 4;
}
