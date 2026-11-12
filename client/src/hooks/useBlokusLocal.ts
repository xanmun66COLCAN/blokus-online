import { useState } from 'react';
import { BoardGrid, Piece, PieceShape, PlayerId, PlayerColor, Move } from '@shared/types/blokus';
import { ALL_PIECES } from '@shared/constants/pieces';
import { BOARD_SIZE, isValidMove } from '@shared/engine/validator';

interface PlayerState {
  id: PlayerId;
  name: string;
  color: PlayerColor;
  pieces: Piece[];
  hasPassed: boolean;
}

const INITIAL_PLAYERS: PlayerState[] = [
  { id: 1, name: 'Jugador 1', color: 'BLUE', pieces: [...ALL_PIECES], hasPassed: false },
  { id: 2, name: 'Jugador 2', color: 'YELLOW', pieces: [...ALL_PIECES], hasPassed: false },
  { id: 3, name: 'Jugador 3', color: 'RED', pieces: [...ALL_PIECES], hasPassed: false },
  { id: 4, name: 'Jugador 4', color: 'GREEN', pieces: [...ALL_PIECES], hasPassed: false },
];

export function useBlokusLocal() {
  const [board, setBoard] = useState<BoardGrid>(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null))
  );
  const [players, setPlayers] = useState<PlayerState[]>(INITIAL_PLAYERS);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [selectedShape, setSelectedShape] = useState<PieceShape | null>(null);

  const activePlayer = players[activePlayerIndex];

  // Es el primer movimiento del jugador si aún tiene las 21 piezas intactas
  const isFirstMove = activePlayer.pieces.length === 21;

  const handleSelectPiece = (piece: Piece) => {
    setSelectedPiece(piece);
    setSelectedShape(piece.shape);
  };

  const handleUpdateShape = (newShape: PieceShape) => {
    setSelectedShape(newShape);
  };

  const placePiece = (row: number, col: number) => {
    if (!selectedPiece || !selectedShape) return false;

    const move: Move = {
      playerId: activePlayer.id,
      pieceId: selectedPiece.id,
      shape: selectedShape,
      row,
      col,
    };

    if (!isValidMove(board, move, isFirstMove)) {
      return false;
    }

    // Actualizar el tablero
    const newBoard = board.map(r => [...r]);
    const shapeRows = selectedShape.length;
    const shapeCols = selectedShape[0].length;

    for (let r = 0; r < shapeRows; r++) {
      for (let c = 0; c < shapeCols; c++) {
        if (selectedShape[r][c] === 1) {
          newBoard[row + r][col + c] = activePlayer.id;
        }
      }
    }

    setBoard(newBoard);

    // Remover la pieza del inventario del jugador actual
    setPlayers(prev =>
      prev.map((p, idx) => {
        if (idx === activePlayerIndex) {
          return {
            ...p,
            pieces: p.pieces.filter(piece => piece.id !== selectedPiece.id),
          };
        }
        return p;
      })
    );

    // Limpiar selección y pasar al siguiente turno (sentido horario: 1 -> 2 -> 3 -> 4 -> 1)
    setSelectedPiece(null);
    setSelectedShape(null);
    setActivePlayerIndex(prev => (prev + 1) % 4);

    return true;
  };

  const passTurn = () => {
    setSelectedPiece(null);
    setSelectedShape(null);
    setActivePlayerIndex(prev => (prev + 1) % 4);
  };

  return {
    board,
    players,
    activePlayer,
    selectedPiece,
    selectedShape,
    isFirstMove,
    handleSelectPiece,
    handleUpdateShape,
    placePiece,
    passTurn,
  };
}