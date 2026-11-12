import { PieceShape } from '../types/blokus';

/** Rotar 90 grados en el sentido de las agujas del reloj */
export function rotateClockwise(shape: PieceShape): PieceShape {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: PieceShape = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

/** Volteo horizontal (mirror izquierda/derecha) */
export function flipHorizontal(shape: PieceShape): PieceShape {
  return shape.map(row => [...row].reverse());
}

/** Volteo vertical (mirror arriba/abajo) */
export function flipVertical(shape: PieceShape): PieceShape {
  return [...shape].reverse();
}

/** Obtiene todas las transformaciones únicas de una pieza */
export function getUniqueOrientations(shape: PieceShape): PieceShape[] {
  const orientations: PieceShape[] = [];
  let current = shape;

  for (let flip = 0; flip < 2; flip++) {
    for (let rot = 0; rot < 4; rot++) {
      if (!orientations.some(existing => areShapesEqual(existing, current))) {
        orientations.push(current);
      }
      current = rotateClockwise(current);
    }
    current = flipHorizontal(shape);
  }

  return orientations;
}

function areShapesEqual(a: PieceShape, b: PieceShape): boolean {
  if (a.length !== b.length || a[0].length !== b[0].length) return false;
  return a.every((row, r) => row.every((val, c) => val === b[r][c]));
}