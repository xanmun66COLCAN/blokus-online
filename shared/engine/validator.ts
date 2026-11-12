import { BoardGrid, Move, PlayerId, PieceShape } from '../types/blokus';

export const BOARD_SIZE = 20;

// Esquinas asignadas para el 1er movimiento de cada jugador
export const STARTING_CORNERS: Record<PlayerId, [number, number]> = {
  1: [0, 0],         // Azul: Superior Izquierda
  2: [0, 19],        // Amarillo: Superior Derecha
  3: [19, 19],       // Rojo: Inferior Derecha
  4: [19, 0],        // Verde: Inferior Izquierda
};

export function isValidMove(board: BoardGrid, move: Move, isFirstMove: boolean): boolean {
  const { playerId, shape, row, col } = move;
  const rows = shape.length;
  const cols = shape[0].length;

  let touchesCorner = false;
  let coversStartCorner = false;
  const startCorner = STARTING_CORNERS[playerId];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (shape[r][c] === 0) continue;

      const boardR = row + r;
      const boardC = col + c;

      // 1. Verificar límites del tablero
      if (boardR < 0 || boardR >= BOARD_SIZE || boardC < 0 || boardC >= BOARD_SIZE) {
        return false;
      }

      // 2. Verificar superposición
      if (board[boardR][boardC] !== null) {
        return false;
      }

      // 3. Primer movimiento debe cubrir la esquina designada
      if (isFirstMove && boardR === startCorner[0] && boardC === startCorner[1]) {
        coversStartCorner = true;
      }

      // 4. Regla de Aristas: NO puede compartir lados con piezas del mismo jugador
      const adjacentCells: [number, number][] = [
        [boardR - 1, boardC],
        [boardR + 1, boardC],
        [boardR, boardC - 1],
        [boardR, boardC + 1],
      ];

      for (const [ar, ac] of adjacentCells) {
        if (ar >= 0 && ar < BOARD_SIZE && ac >= 0 && ac < BOARD_SIZE) {
          if (board[ar][ac] === playerId) {
            return false; // Prohibido contacto por lados con piezas propias
          }
        }
      }

      // 5. Regla de Vértices: Debe tocar al menos una esquina de una pieza propia
      if (!isFirstMove) {
        const diagonalCells: [number, number][] = [
          [boardR - 1, boardC - 1],
          [boardR - 1, boardC + 1],
          [boardR + 1, boardC - 1],
          [boardR + 1, boardC + 1],
        ];

        for (const [dr, dc] of diagonalCells) {
          if (dr >= 0 && dr < BOARD_SIZE && dc >= 0 && dc < BOARD_SIZE) {
            if (board[dr][dc] === playerId) {
              touchesCorner = true;
            }
          }
        }
      }
    }
  }

  if (isFirstMove) {
    return coversStartCorner;
  }

  return touchesCorner;
}