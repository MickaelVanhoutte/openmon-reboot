export interface Map {
    label: string;
    width: number;
    height: number;

    grid: number[][];
}

export interface Tile {
    index: number;
    color: string;
}