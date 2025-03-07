import type {FullDexEntry} from '$lib/pokedex/fulldex';
import type {Map} from '$lib/maps/map.model';

export interface GameData {
    id?: number;
    pokedex: FullDexEntry[];
    maps: Map[];
}