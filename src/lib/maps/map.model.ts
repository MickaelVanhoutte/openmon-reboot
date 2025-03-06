export interface Map {
  id: string;
  label: string;
  width: number;
  height: number;

  layers: Layer[];
}

export interface Layer {
  label?: string;
  visible: boolean;
  grid: { x: number; y: number }[][];
}
