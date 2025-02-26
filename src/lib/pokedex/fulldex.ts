interface FullDexEntry {
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
}