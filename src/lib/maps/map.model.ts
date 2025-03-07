export interface Map {
  id: string;
  label: string;
  width: number;
  height: number;
  minimap?: string;
  layers: Layer[];
}

export interface Layer {
  label?: string;
  visible: boolean;
  grid: { x: number; y: number }[][];
}


export interface TilesetConfig {
  name: string;
  tileSize: number;
  x: number;
  y: number;
}