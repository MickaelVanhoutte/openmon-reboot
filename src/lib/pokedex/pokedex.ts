export class Nature {
  public id: number;
  public identifier: string;
  public decreasedStatId: string;
  public increasedStatId: string;

  constructor(id: number, identifier: string, decreasedStatId: string, increasedStatId: string) {
    this.id = id;
    this.identifier = identifier;
    this.decreasedStatId = decreasedStatId;
    this.increasedStatId = increasedStatId;
  }
}

export class Stats {
  public hp: number;
  public attack: number;
  public defense: number;
  public specialAttack: number;
  public specialDefense: number;
  public speed: number;
  public total: number;

  public accuracy: number;
  public evasion: number;

  constructor(
    hp: number = 0,
    attack: number = 0,
    defense: number = 0,
    specialAttack: number = 0,
    specialDefense: number = 0,
    speed: number = 0,
    evasion: number = 0,
    accuracy: number = 0,
    total?: number,
  ) {
    this.hp = hp;
    this.attack = attack;
    this.defense = defense;
    this.specialAttack = specialAttack;
    this.specialDefense = specialDefense;
    this.speed = speed;
    if (total) {
      this.total = total;
    } else {
      this.total =
        this.hp +
        this.attack +
        this.defense +
        this.specialAttack +
        this.specialDefense +
        this.speed;
    }
    this.accuracy = accuracy;
    this.evasion = evasion;
  }
}

export class Evolution {
  public id: number;
  public level: number;
  public method: string;

  constructor(nextId: number, level: number, method: string) {
    this.id = nextId;
    this.level = level;
    this.method = method;
  }
}

export class MoveEffect {
  move_effect_id: number;
  local_language_id: number;
  short_effect: string;
  effect: string;

  constructor(
    move_effect_id: number,
    local_language_id: number,
    short_effect: string,
    effect: string,
  ) {
    this.move_effect_id = move_effect_id;
    this.local_language_id = local_language_id;
    this.short_effect = short_effect;
    this.effect = effect;
  }

  //public apply(target: PokemonInstance[]) {
  // Effect chance is applied earlier since info is on the move

  //}
}

export class Move {
  public id: number;
  public name: string;
  public type: string;
  public category: 'physical' | 'special' | 'no-damage';
  public power: number;
  public accuracy: number;
  public pp: number;
  public priority: number;
  public target: string;
  public effect: MoveEffect;
  public effectChance: number;
  public description: string;
  public level: number;
  public method: number;

  constructor(
    id: number,
    name: string,
    type: string,
    category: 'physical' | 'special' | 'no-damage',
    power: number,
    accuracy: number,
    pp: number,
    priority: number,
    target:
      | 'all-opponents'
      | 'selected-pokemon'
      | 'users-field'
      | 'user'
      | 'user-and-allies'
      | 'entire-field'
      | 'random-opponent'
      | 'all-other-pokemon'
      | 'specific-move'
      | 'opponents-field'
      | 'ally'
      | 'all-pokemon'
      | 'user-or-ally',
    effect: MoveEffect,
    effectChance: number,
    description: string,
    level: number,
    method: number = 1,
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.category = category;
    this.power = power;
    this.accuracy = accuracy;
    this.pp = pp;
    this.priority = priority;
    this.target = target;
    this.effect = effect;
    this.effectChance = effectChance;
    this.description = description;
    this.level = level;
    this.method = method;
  }
}

export class Sprites {
  front?: string;
  back?: string;
  shinyFront?: string;
  shinyBack?: string;
}

export class PokedexEntry {
  public id: number = 0;
  public regionalId: number = 0;
  public name: string = 'UNKNOWN';
  public types: string[] = [];
  public abilities: string[] = [];
  public moves: Move[] = [];
  public stats: Stats = new Stats();
  public height: number = 0;
  public weight: number = 0;
  public description: string = 'UNKNOWN';
  public isLegendary: boolean = false;
  public captureRate: number = 1;
  public growthRateId: number = 1;
  public baseXp: number = 1;
  public percentageMale: number = 0.5;
  public evolution: Evolution[] = [];
  public sprites?: Sprites;

  public viewed: boolean = false;
  public caught: boolean = false;

  constructor(id: number, name: string, sprites: Sprites) {
    this.id = id;
    this.name = name;
    this.sprites = sprites;
  }
}

export const NATURES: Nature[] = [
  {
    id: 1,
    identifier: 'hardy',
    decreasedStatId: 'attack',
    increasedStatId: 'attack',
  },
  {
    id: 2,
    identifier: 'bold',
    decreasedStatId: 'attack',
    increasedStatId: 'defense',
  },
  {
    id: 3,
    identifier: 'modest',
    decreasedStatId: 'attack',
    increasedStatId: 'specialAttack',
  },
  {
    id: 4,
    identifier: 'calm',
    decreasedStatId: 'attack',
    increasedStatId: 'specialDefense',
  },
  {
    id: 5,
    identifier: 'timid',
    decreasedStatId: 'attack',
    increasedStatId: 'speed',
  },
  {
    id: 6,
    identifier: 'lonely',
    decreasedStatId: 'defense',
    increasedStatId: 'attack',
  },
  {
    id: 7,
    identifier: 'docile',
    decreasedStatId: 'defense',
    increasedStatId: 'defense',
  },
  {
    id: 8,
    identifier: 'mild',
    decreasedStatId: 'defense',
    increasedStatId: 'specialAttack',
  },
  {
    id: 9,
    identifier: 'gentle',
    decreasedStatId: 'defense',
    increasedStatId: 'specialDefense',
  },
  {
    id: 10,
    identifier: 'hasty',
    decreasedStatId: 'defense',
    increasedStatId: 'speed',
  },
  {
    id: 11,
    identifier: 'adamant',
    decreasedStatId: 'specialAttack',
    increasedStatId: 'attack',
  },
  {
    id: 12,
    identifier: 'impish',
    decreasedStatId: 'specialAttack',
    increasedStatId: 'defense',
  },
  {
    id: 13,
    identifier: 'bashful',
    decreasedStatId: 'specialAttack',
    increasedStatId: 'specialAttack',
  },
  {
    id: 14,
    identifier: 'careful',
    decreasedStatId: 'specialAttack',
    increasedStatId: 'specialDefense',
  },
  {
    id: 15,
    identifier: 'rash',
    decreasedStatId: 'specialDefense',
    increasedStatId: 'specialAttack',
  },
  {
    id: 16,
    identifier: 'jolly',
    decreasedStatId: 'specialAttack',
    increasedStatId: 'speed',
  },
  {
    id: 17,
    identifier: 'naughty',
    decreasedStatId: 'specialDefense',
    increasedStatId: 'attack',
  },
  {
    id: 18,
    identifier: 'lax',
    decreasedStatId: 'specialDefense',
    increasedStatId: 'defense',
  },
  {
    id: 19,
    identifier: 'quirky',
    decreasedStatId: 'specialDefense',
    increasedStatId: 'specialDefense',
  },
  {
    id: 20,
    identifier: 'naive',
    decreasedStatId: 'specialDefense',
    increasedStatId: 'speed',
  },
  {
    id: 21,
    identifier: 'brave',
    decreasedStatId: 'speed',
    increasedStatId: 'attack',
  },
  {
    id: 22,
    identifier: 'relaxed',
    decreasedStatId: 'speed',
    increasedStatId: 'defense',
  },
  {
    id: 23,
    identifier: 'quiet',
    decreasedStatId: 'speed',
    increasedStatId: 'specialAttack',
  },
  {
    id: 24,
    identifier: 'sassy',
    decreasedStatId: 'speed',
    increasedStatId: 'specialDefense',
  },
  {
    id: 25,
    identifier: 'serious',
    decreasedStatId: 'speed',
    increasedStatId: 'speed',
  },
];
