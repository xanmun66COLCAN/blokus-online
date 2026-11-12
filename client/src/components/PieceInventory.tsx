import React from 'react';
import { Piece, PieceShape, PlayerColor, PlayerId } from '@shared/types/blokus';
import { rotateClockwise, flipHorizontal, flipVertical } from '@shared/engine/pieceTransforms';
import { THEME } from '../theme/blokusTheme';

interface PieceInventoryProps {
  availablePieces: Piece[];
  selectedPiece: Piece | null;
  selectedShape: PieceShape | null;
  onSelectPiece: (piece: Piece) => void;
  onUpdateShape: (newShape: PieceShape) => void;
  activePlayerColor: PlayerColor;
  activePlayerId: PlayerId;
}

export const PieceInventory: React.FC<PieceInventoryProps> = ({
  availablePieces,
  selectedPiece,
  selectedShape,
  onSelectPiece,
  onUpdateShape,
  activePlayerColor,
}) => {
  const playerTheme = THEME.players[activePlayerColor];

  const handleRotate = () => {
    if (selectedShape) onUpdateShape(rotateClockwise(selectedShape));
  };

  const handleFlipH = () => {
    if (selectedShape) onUpdateShape(flipHorizontal(selectedShape));
  };

  const handleFlipV = () => {
    if (selectedShape) onUpdateShape(flipVertical(selectedShape));
  };

  return (
    <div className={`flex flex-col gap-4 p-4 rounded-2xl ${THEME.layout.panel} w-full max-w-md`}>
      {/* Controles de Transformación */}
      <div className={`flex flex-col gap-2.5 p-3 rounded-xl ${THEME.layout.panelInner}`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Pieza Seleccionada
          </span>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${playerTheme.badge}`}>
            {selectedPiece ? selectedPiece.name : 'Ninguna'}
          </span>
        </div>

        <div className="flex gap-2 items-center justify-between">
          <button
            onClick={handleRotate}
            disabled={!selectedPiece}
            className="flex-1 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg border border-slate-700 transition cursor-pointer shadow-sm"
          >
            ↻ Rotar 90°
          </button>
          <button
            onClick={handleFlipH}
            disabled={!selectedPiece}
            className="flex-1 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg border border-slate-700 transition cursor-pointer shadow-sm"
          >
            ⇄ Espejo H
          </button>
          <button
            onClick={handleFlipV}
            disabled={!selectedPiece}
            className="flex-1 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg border border-slate-700 transition cursor-pointer shadow-sm"
          >
            ⇅ Espejo V
          </button>
        </div>

        {/* Miniatura de la pieza seleccionada con efecto neón */}
        {selectedShape && (
          <div className="flex justify-center p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 min-h-[90px] items-center">
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${selectedShape[0].length}, minmax(0, 1fr))` }}>
              {selectedShape.map((row, r) =>
                row.map((val, c) => (
                  <div
                    key={`prev-${r}-${c}`}
                    className={`w-4 h-4 rounded-[3px] transition-all ${
                      val === 1 ? `${playerTheme.cell} ${playerTheme.glow}` : 'bg-transparent'
                    }`}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Catálogo de Piezas Disponibles */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Inventario
          </span>
          <span className="text-xs font-mono text-indigo-400 font-semibold">
            {availablePieces.length} / 21 disp.
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 max-h-[260px] overflow-y-auto pr-1">
          {availablePieces.map((piece) => {
            const isSelected = selectedPiece?.id === piece.id;
            return (
              <button
                key={piece.id}
                onClick={() => onSelectPiece(piece)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10 scale-105'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-mono font-bold">{piece.name}</span>
                <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${piece.shape[0].length}, minmax(0, 1fr))` }}>
                  {piece.shape.map((row, r) =>
                    row.map((val, c) => (
                      <div
                        key={`inv-${piece.id}-${r}-${c}`}
                        className={`w-2.5 h-2.5 rounded-[1px] ${
                          val === 1 ? playerTheme.cell : 'bg-transparent'
                        }`}
                      />
                    ))
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};