import { Piece } from '../types/blokus';

export const ALL_PIECES: Piece[] = [
  // 1. Monominó (1)
  { id: 1, name: 'O1', size: 1, shape: [[1]] },

  // 2. Dominó (1)
  { id: 2, name: 'I2', size: 2, shape: [[1, 1]] },

  // 3. Triminós (2)
  { id: 3, name: 'I3', size: 3, shape: [[1, 1, 1]] },
  { id: 4, name: 'L3', size: 3, shape: [[1, 0], [1, 1]] },

  // 4. Tetraminós (5)
  { id: 5, name: 'I4', size: 4, shape: [[1, 1, 1, 1]] },
  { id: 6, name: 'L4', size: 4, shape: [[1, 0, 0], [1, 1, 1]] },
  { id: 7, name: 'O4', size: 4, shape: [[1, 1], [1, 1]] },
  { id: 8, name: 'T4', size: 4, shape: [[1, 1, 1], [0, 1, 0]] },
  { id: 9, name: 'Z4', size: 4, shape: [[1, 1, 0], [0, 1, 1]] },

  // 5. Pentominós (12)
  { id: 10, name: 'F5', size: 5, shape: [[0, 1, 1], [1, 1, 0], [0, 1, 0]] },
  { id: 11, name: 'I5', size: 5, shape: [[1, 1, 1, 1, 1]] },
  { id: 12, name: 'L5', size: 5, shape: [[1, 0, 0, 0], [1, 1, 1, 1]] },
  { id: 13, name: 'N5', size: 5, shape: [[1, 1, 0, 0], [0, 1, 1, 1]] },
  { id: 14, name: 'P5', size: 5, shape: [[1, 1, 1], [1, 1, 0]] },
  { id: 15, name: 'T5', size: 5, shape: [[1, 1, 1], [0, 1, 0], [0, 1, 0]] },
  { id: 16, name: 'U5', size: 5, shape: [[1, 0, 1], [1, 1, 1]] },
  { id: 17, name: 'V5', size: 5, shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]] },
  { id: 18, name: 'W5', size: 5, shape: [[1, 0, 0], [1, 1, 0], [0, 1, 1]] },
  { id: 19, name: 'X5', size: 5, shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]] },
  { id: 20, name: 'Y5', size: 5, shape: [[1, 0, 0, 0], [1, 1, 1, 1]] },
  { id: 21, name: 'Z5', size: 5, shape: [[1, 1, 0], [0, 1, 0], [0, 1, 1]] }
];