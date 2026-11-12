import React, { useState } from 'react';
import { BoardGrid, PieceShape, PlayerId } from '@shared/types/blokus';
import { BOARD_SIZE, isValidMove } from '@shared/engine/validator';
import { THEME } from '../theme/blokusTheme';

interface BoardProps {
  board: BoardGrid;
  activePlayerId: PlayerId;
  selectedPieceShape: PieceShape | null;
  isFirstMove: boolean;
  onPlacePiece: (row: number, col: number) => void;
}

const PLAYER_THEME_MAP: Record<number, typeof THEME.players.BLUE> = {
  1: THEME.players.BLUE,
  2: THEME.players.YELLOW,
  3: THEME.players.RED,
  4: THEME.players.GREEN,
};

const ACTIVE_PLAYER_COLOR_MAP: Record<PlayerId, keyof typeof THEME.players> = {
  1: 'BLUE',
  2: 'YELLOW',
  3: 'RED',
  4: 'GREEN',
};

export const Board: React.FC<BoardProps> = ({
  board,
  activePlayerId,
  selectedPieceShape,
  isFirstMove,
  onPlacePiece,
}) => {
  const [hoverCoord, setHoverCoord] = useState<{ row: number; col: number } | null>(null);

  const activeColorKey = ACTIVE_PLAYER_COLOR_MAP[activePlayerId];
  const activePlayerTheme = THEME.players[activeColorKey];

  // Calcular si la celda actual forma parte de la pieza en previsualización
  const getPreviewState = (r: number, c: number): 'valid' | 'invalid' | null => {
    if (!selectedPieceShape || !hoverCoord) return null;

    const pieceRows = selectedPieceShape.length;
    const pieceCols = selectedPieceShape[0].length;

    const relR = r - hoverCoord.row;
    const relC = c - hoverCoord.col;

    if (relR >= 0 && relR < pieceRows && relC >= 0 && relC < pieceCols) {
      if (selectedPieceShape[relR][relC] === 1) {
        const dummyMove = {
          playerId: activePlayerId,
          pieceId: 0,
          shape: selectedPieceShape,
          row: hoverCoord.row,
          col: hoverCoord.col,
        };
        const valid = isValidMove(board, dummyMove, isFirstMove);
        return valid ? 'valid' : 'invalid';
      }
    }
    return null;
  };

  return (
    <div className={`p-4 rounded-2xl ${THEME.layout.panel} inline-block shadow-2xl`}>
      <div
        className="grid gap-[2px] bg-slate-950/80 p-2 rounded-xl border border-slate-800/80"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
        }}
        onMouseLeave={() => setHoverCoord(null)}
      >
        {board.map((row, r) =>
          row.map((cellValue, c) => {
            const playerTheme = cellValue ? PLAYER_THEME_MAP[cellValue] : null;
            const previewState = getPreviewState(r, c);

            // Estilos por defecto de la celda vacía (efecto rejilla táctica)
            let cellStyle = 'bg-slate-900/60 border border-slate-800/40 hover:bg-slate-800/60';

            if (playerTheme) {
              // Celda ocupada por una ficha con brillo neón
              cellStyle = `${playerTheme.cell} ${playerTheme.glow}`;
            } else if (previewState === 'valid') {
              // Previsualización legal en verde brillante
              cellStyle = `${activePlayerTheme.cell} opacity-75 ${activePlayerTheme.glow} animate-pulse`;
            } else if (previewState === 'invalid') {
              // Previsualización ilegal en rojo neón
              cellStyle = 'bg-rose-600/60 border-rose-400 shadow-[0_0_10px_rgba(225,29,72,0.6)]';
            }

            return (
              <div
                key={`cell-${r}-${c}`}
                onMouseEnter={() => setHoverCoord({ row: r, col: c })}
                onClick={() => {
                  if (selectedPieceShape) {
                    onPlacePiece(r, c);
                  }
                }}
                className={`w-5 h-5 sm:w-7 sm:h-7 rounded-[4px] transition-all duration-75 cursor-pointer ${cellStyle}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
};