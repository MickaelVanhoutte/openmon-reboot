export interface Map {
  id: string;
  label: string;
  width: number;
  height: number;

  grid: number[][];
}

export interface Tile {
  index: number;
  color: string;
}
