export interface Map {
  id: string;
  label: string;
  width: number;
  height: number;

  grid: { x: number; y: number }[][];
}

export interface Tile {
  index: number;
  color: string;
}
