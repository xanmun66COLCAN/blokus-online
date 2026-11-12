export type PlayerColor = 'BLUE' | 'YELLOW' | 'RED' | 'GREEN';

export type PlayerId = 1 | 2 | 3 | 4;

export interface PlayerInfo {
  id: PlayerId;
  name: string;
  color: PlayerColor;
  isReady: boolean;
  hasPassed: boolean;
}

// Matriz 2D donde 1 representa un cuadrado de la pieza y 0 vacío
export type PieceShape = number[][];

export interface Piece {
  id: number;
  name: string;
  size: number; // 1 (monominó) a 5 (pentominó)
  shape: PieceShape;
}

// Estado del tablero: null o el ID del jugador ocupante (1, 2, 3 o 4)
export type CellState = PlayerId | null;
export type BoardGrid = CellState[][];

export interface Move {
  playerId: PlayerId;
  pieceId: number;
  shape: PieceShape; // Matriz con las rotaciones/reflexiones aplicadas
  row: number;       // Coordenada superior izquierda en el tablero
  col: number;
}