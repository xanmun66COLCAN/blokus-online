import React, { useState } from 'react';
import { useBlokusLocal } from './hooks/useBlokusLocal';
import { useBlokusOnline } from './hooks/useBlokusOnline';
import { Board } from './components/Board';
import { PieceInventory } from './components/PieceInventory';
import { Lobby } from './components/Lobby';

export function App() {
  const [mode, setMode] = useState<'ONLINE' | 'LOCAL'>('ONLINE');

  const localGame = useBlokusLocal();
  const onlineGame = useBlokusOnline();

  // MODO LOCAL (Pass & Play)
  if (mode === 'LOCAL') {
    const {
      board,
      activePlayer,
      selectedPiece,
      selectedShape,
      isFirstMove,
      handleSelectPiece,
      handleUpdateShape,
      placePiece,
      passTurn,
    } = localGame;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6">
        <header className="flex flex-col items-center gap-1 mb-4">
          <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 via-amber-400 to-red-500 bg-clip-text text-transparent">
            BLOKUS ONLINE
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-xs text-slate-400">Modo Local (Pass & Play)</p>
            <button
              onClick={() => setMode('ONLINE')}
              className="text-xs text-indigo-400 hover:underline cursor-pointer"
            >
              Volver al Lobby Online
            </button>
          </div>
        </header>

        <div className="flex items-center justify-between w-full max-w-5xl mb-4 p-3 bg-slate-900 rounded-xl border border-slate-800 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm sm:text-base">
              Turno de: <span className="text-indigo-400">{activePlayer.name}</span> ({activePlayer.color})
            </span>
          </div>
          <button
            onClick={passTurn}
            className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            Pasar Turno
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center w-full max-w-5xl">
          <div className="flex-1 flex justify-center w-full">
            <Board
              board={board}
              activePlayerId={activePlayer.id}
              selectedPieceShape={selectedShape}
              isFirstMove={isFirstMove}
              onPlacePiece={placePiece}
            />
          </div>
          <div className="w-full lg:w-auto flex justify-center">
            <PieceInventory
              availablePieces={activePlayer.pieces}
              selectedPiece={selectedPiece}
              selectedShape={selectedShape}
              onSelectPiece={handleSelectPiece}
              onUpdateShape={handleUpdateShape}
              activePlayerColor={activePlayer.color}
              activePlayerId={activePlayer.id}
            />
          </div>
        </div>
      </div>
    );
  }

  // MODO ONLINE: Mostrar Lobby si no hay sala o si la partida aún no empieza
  if (!onlineGame.roomData || onlineGame.roomData.status === 'WAITING') {
    return (
      <Lobby
        roomData={onlineGame.roomData}
        myPlayerId={onlineGame.myPlayerId}
        errorMessage={onlineGame.errorMessage}
        onJoinRoom={onlineGame.joinRoom}
        onStartGame={onlineGame.startGame}
        onSwitchToLocal={() => setMode('LOCAL')}
      />
    );
  }

  // MODO ONLINE: Partida en curso
  const { roomData, myPlayerId } = onlineGame;
  const currentTurnPlayer = roomData.players[roomData.activeTurnIndex];
  const me = roomData.players.find((p) => p.id === myPlayerId) || currentTurnPlayer;
  const isMyTurn = currentTurnPlayer?.id === myPlayerId;
  const isFirstMove = me.pieces.length === 21;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6">
      <header className="flex flex-col items-center gap-1 mb-4">
        <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 via-amber-400 to-red-500 bg-clip-text text-transparent">
          BLOKUS ONLINE
        </h1>
        <p className="text-xs text-slate-400">
          Sala: <span className="font-mono font-bold text-indigo-400">{roomData.roomId}</span> — Eres{' '}
          <span className="font-semibold text-slate-200">{me.name}</span> ({me.color})
        </p>
      </header>

      <div className="flex items-center justify-between w-full max-w-5xl mb-4 p-3 bg-slate-900 rounded-xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm sm:text-base">
            {isMyTurn ? (
              <span className="text-emerald-400">¡Es tu turno! Coloca una pieza</span>
            ) : (
              <>
                Esperando jugada de: <span className="text-indigo-400">{currentTurnPlayer.name}</span> ({currentTurnPlayer.color})
              </>
            )}
          </span>
        </div>
        {isMyTurn && (
          <button
            onClick={onlineGame.passTurn}
            className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            Pasar Turno
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center w-full max-w-5xl">
        <div className="flex-1 flex justify-center w-full">
          <Board
            board={roomData.board}
            activePlayerId={me.id}
            selectedPieceShape={isMyTurn ? onlineGame.selectedShape : null}
            isFirstMove={isFirstMove}
            onPlacePiece={onlineGame.placePiece}
          />
        </div>

        <div className="w-full lg:w-auto flex justify-center">
          <PieceInventory
            availablePieces={me.pieces}
            selectedPiece={onlineGame.selectedPiece}
            selectedShape={onlineGame.selectedShape}
            onSelectPiece={onlineGame.handleSelectPiece}
            onUpdateShape={onlineGame.handleUpdateShape}
            activePlayerColor={me.color}
            activePlayerId={me.id}
          />
        </div>
      </div>
    </div>
  );
}



export default App;