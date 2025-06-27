export interface Player {
  name: string;
  score: number;
  turn: boolean;
  userId?: number; // Agregado para soporte con la API
}
