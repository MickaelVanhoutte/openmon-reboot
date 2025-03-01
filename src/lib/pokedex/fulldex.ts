export interface Generation {
  name: string;
  id: number;
  indexes: number[];
}


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
    prev: [string, string];
    next: [string, string];
  };
  profile: {
    height: string;
    weight: string;
    egg: string[];
    ability: [string, string][]; // [ability, hidden]
    gender: string;
  };
  image: {
    sprite: string;
    thumbnail: string;
    hires: string;
  };
  moves: Move[];
}

export const typeChart = {
  "normal": {
      "normal": 1,
      "fire": 1,
      "water": 1,
      "electric": 1,
      "grass": 1,
      "ice": 1,
      "fighting": 1,
      "poison": 1,
      "ground": 1,
      "flying": 1,
      "psychic": 1,
      "bug": 1,
      "rock": 0.5,
      "ghost": 0,
      "dragon": 1,
      "dark": 1,
      "steel": 0.5,
      "fairy": 1,
      color: 'rgb(148, 155, 163)'
  },
  "fire": {
      "normal": 1,
      "fire": 0.5,
      "water": 0.5,
      "electric": 1,
      "grass": 2,
      "ice": 2,
      "fighting": 1,
      "poison": 1,
      "ground": 1,
      "flying": 1,
      "psychic": 1,
      "bug": 2,
      "rock": 0.5,
      "ghost": 1,
      "dragon": 0.5,
      "dark": 1,
      "steel": 2,
      "fairy": 1,
      color: 'rgb(241,163,98)'
  },
  "water": {
      "normal": 1,
      "fire": 2,
      "water": 0.5,
      "electric": 1,
      "grass": 0.5,
      "ice": 1,
      "fighting": 1,
      "poison": 1,
      "ground": 2,
      "flying": 1,
      "psychic": 1,
      "bug": 1,
      "rock": 2,
      "ghost": 1,
      "dragon": 0.5,
      "dark": 1,
      "steel": 1,
      "fairy": 1,
      color: 'rgb(95, 144, 210)',
  },
  "electric": {
      "normal": 1,
      "fire": 1,
      "water": 2,
      "electric": 0.5,
      "grass": 0.5,
      "ice": 1,
      "fighting": 1,
      "poison": 1,
      "ground": 0,
      "flying": 2,
      "psychic": 1,
      "bug": 1,
      "rock": 1,
      "ghost": 1,
      "dragon": 0.5,
      "dark": 1,
      "steel": 1,
      "fairy": 1,
      color: 'rgb(239, 212, 89)'
  },
  "grass": {
      "normal": 1,
      "fire": 0.5,
      "water": 2,
      "electric": 1,
      "grass": 0.5,
      "ice": 1,
      "fighting": 1,
      "poison": 0.5,
      "ground": 2,
      "flying": 0.5,
      "psychic": 1,
      "bug": 0.5,
      "rock": 2,
      "ghost": 1,
      "dragon": 0.5,
      "dark": 1,
      "steel": 0.5,
      "fairy": 1,
      color: 'rgb(122,187,101)'
  },
  "ice": {
      "normal": 1,
      "fire": 0.5,
      "water": 0.5,
      "electric": 1,
      "grass": 2,
      "ice": 0.5,
      "fighting": 1,
      "poison": 1,
      "ground": 2,
      "flying": 2,
      "psychic": 1,
      "bug": 1,
      "rock": 1,
      "ghost": 1,
      "dragon": 2,
      "dark": 1,
      "steel": 0.5,
      "fairy": 1,
      color: 'rgb(138, 205, 193)'
  },
  "fighting": {
      "normal": 2,
      "fire": 1,
      "water": 1,
      "electric": 1,
      "grass": 1,
      "ice": 2,
      "fighting": 1,
      "poison": 0.5,
      "ground": 1,
      "flying": 0.5,
      "psychic": 0.5,
      "bug": 0.5,
      "rock": 2,
      "ghost": 0,
      "dragon": 1,
      "dark": 2,
      "steel": 2,
      "fairy": .5,
      color: 'rgb(191, 74, 108)',
  },
  "poison": {
      "normal": 1,
      "fire": 1,
      "water": 1,
      "electric": 1,
      "grass": 2,
      "ice": 1,
      "fighting": 1,
      "poison": 0.5,
      "ground": 0.5,
      "flying": 1,
      "psychic": 1,
      "bug": 1,
      "rock": 0.5,
      "ghost": 0.5,
      "dragon": 1,
      "dark": 1,
      "steel": 0,
      "fairy": 2,
      color: 'rgb(162, 110, 196)'
  },
  "ground": {
      "normal": 1,
      "fire": 2,
      "water": 1,
      "electric": 2,
      "grass": 0.5,
      "ice": 1,
      "fighting": 1,
      "poison": 2,
      "ground": 1,
      "flying": 0,
      "psychic": 1,
      "bug": 0.5,
      "rock": 2,
      "ghost": 1,
      "dragon": 1,
      "dark": 1,
      "steel": 2,
      "fairy": 1,
      color: 'rgb(205, 126, 78)'
  },
  "flying": {
      "normal": 1,
      "fire": 1,
      "water": 1,
      "electric": 0.5,
      "grass": 2,
      "ice": 1,
      "fighting": 2,
      "poison": 1,
      "ground": 1,
      "flying": 1,
      "psychic": 1,
      "bug": 2,
      "rock": 0.5,
      "ghost": 1,
      "dragon": 1,
      "dark": 1,
      "steel": 0.5,
      "fairy": 1,
      color: 'rgb(149, 170, 219)'
  },
  "psychic": {
      "normal": 1,
      "fire": 1,
      "water": 1,
      "electric": 1,
      "grass": 1,
      "ice": 1,
      "fighting": 2,
      "poison": 2,
      "ground": 1,
      "flying": 1,
      "psychic": 0.5,
      "bug": 1,
      "rock": 1,
      "ghost": 1,
      "dragon": 1,
      "dark": 0,
      "steel": 0.5,
      "fairy": 1,
      color: 'rgb(233, 122, 125)'
  },
  "bug": {
      "normal": 1,
      "fire": 0.5,
      "water": 1,
      "electric": 1,
      "grass": 2,
      "ice": 1,
      "fighting": 0.5,
      "poison": 0.5,
      "ground": 1,
      "flying": 0.5,
      "psychic": 2,
      "bug": 1,
      "rock": 1,
      "ghost": 0.5,
      "dragon": 1,
      "dark": 2,
      "steel": 0.5,
      "fairy": .5,
      color: 'rgb(156, 193, 73)'
  },
  "rock": {
      "normal": 1,
      "fire": 2,
      "water": 1,
      "electric": 1,
      "grass": 1,
      "ice": 2,
      "fighting": 0.5,
      "poison": 1,
      "ground": 0.5,
      "flying": 2,
      "psychic": 1,
      "bug": 2,
      "rock": 1,
      "ghost": 1,
      "dragon": 1,
      "dark": 1,
      "steel": 0.5,
      "fairy": 1,
      color: 'rgb(196, 185, 146)'
  },
  "ghost": {
      "normal": 0,
      "fire": 1,
      "water": 1,
      "electric": 1,
      "grass": 1,
      "ice": 1,
      "fighting": 1,
      "poison": 1,
      "ground": 1,
      "flying": 1,
      "psychic": 2,
      "bug": 1,
      "rock": 1,
      "ghost": 2,
      "dragon": 1,
      "dark": 0.5,
      "steel": 0.5,
      "fairy": 1,
      color: 'rgb(86, 105, 170)'
  },
  "dragon": {
      "normal": 1,
      "fire": 1,
      "water": 1,
      "electric": 1,
      "grass": 1,
      "ice": 1,
      "fighting": 1,
      "poison": 1,
      "ground": 1,
      "flying": 1,
      "psychic": 1,
      "bug": 1,
      "rock": 1,
      "ghost": 1,
      "dragon": 2,
      "dark": 1,
      "steel": 0.5,
      "fairy": 0,
      color: 'rgb(47, 108, 190)'
  },
  "dark": {
      "normal": 1,
      "fire": 1,
      "water": 1,
      "electric": 1,
      "grass": 1,
      "ice": 1,
      "fighting": 0.5,
      "poison": 1,
      "ground": 1,
      "flying": 1,
      "psychic": 2,
      "bug": 1,
      "rock": 1,
      "ghost": 2,
      "dragon": 1,
      "dark": 0.5,
      "steel": 0.5,
      "fairy": .5,
      color: 'rgb(88, 83, 100)'
  },
  "steel": {
      "normal": 1,
      "fire": 0.5,
      "water": 0.5,
      "electric": 0.5,
      "grass": 1,
      "ice": 2,
      "fighting": 1,
      "poison": 1,
      "ground": 1,
      "flying": 1,
      "psychic": 1,
      "bug": 1,
      "rock": 2,
      "ghost": 1,
      "dragon": 1,
      "dark": 1,
      "steel": 0.5,
      "fairy": 2,
      color: 'rgb(102, 142, 161)'
  },
  "fairy": {
      "normal": 1,
      "fire": .5,
      "water": 1,
      "electric": 1,
      "grass": 1,
      "ice": 1,
      "fighting": 2,
      "poison": .5,
      "ground": 1,
      "flying": 1,
      "psychic": 1,
      "bug": 1,
      "rock": 1,
      "ghost": 1,
      "dragon": 2,
      "dark": 2,
      "steel": .5,
      "color": 'rgb(224, 149, 226)'
  }
}