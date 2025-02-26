export interface Move {
  id: number;
  name: string;
  type: string;
  category: string;
  power: string;
  accuracy: string;
  pp: number;
  priority: number;
  target: string;
  effect: {
    move_effect_id: number;
    local_language_id: number;
    short_effect: string;
    effect: string;
  };
  effectChance: number;
  description: string;
  method: string;
  level: string;
}

export interface FullDexEntry {
  id: number;
  name: {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
  };
  type: string[];
  base: {
    HP: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  species: string;
  description: string;
  evolution: {
    next: [string, string][];
  };
  profile: {
    height: string;
    weight: string;
    egg: string[];
    ability: [string, string][];
    gender: string;
  };
  image: {
    sprite: string;
    thumbnail: string;
    hires: string;
  };
  moves: Move[];
}
