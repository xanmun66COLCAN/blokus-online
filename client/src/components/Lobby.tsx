import React, { useState } from 'react';
import { PlayerColor, PlayerId } from '@shared/types/blokus';
import { THEME } from '../theme/blokusTheme';

interface LobbyPlayer {
  socketId: string;
  id: PlayerId;
  name: string;
  color: PlayerColor;
}

interface LobbyProps {
  roomData: {
    roomId: string;
    players: LobbyPlayer[];
    status: 'WAITING' | 'PLAYING' | 'FINISHED';
  } | null;
  myPlayerId: PlayerId | null;
  errorMessage: string | null;
  onJoinRoom: (roomId: string, playerName: string) => void;
  onStartGame: (roomId: string) => void;
  onSwitchToLocal: () => void;
}

const PLAYER_THEME_MAP: Record<PlayerColor, typeof THEME.players.BLUE> = {
  BLUE: THEME.players.BLUE,
  YELLOW: THEME.players.YELLOW,
  RED: THEME.players.RED,
  GREEN: THEME.players.GREEN,
};

export const Lobby: React.FC<LobbyProps> = ({
  roomData,
  myPlayerId,
  errorMessage,
  onJoinRoom,
  onStartGame,
  onSwitchToLocal,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const generateRandomCode = () => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomCode(code);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !roomCode.trim()) return;
    onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
  };

  return (
    <div className={`min-h-screen ${THEME.layout.bg} text-slate-100 flex flex-col items-center justify-center p-4`}>
      <div className={`w-full max-w-md ${THEME.layout.panel} rounded-2xl p-6 sm:p-8`}>
        {/* Encabezado */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 via-amber-400 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
            BLOKUS ONLINE
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">
            Cyber-Tactical Edition
          </p>
        </div>

        {/* Mensajes de Error */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-medium text-center shadow-lg shadow-rose-950/50">
            {errorMessage}
          </div>
        )}

        {/* VISTA 1: Formulario para ingresar o crear sala */}
        {!roomData ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Tu Nombre Táctico
              </label>
              <input
                type="text"
                maxLength={16}
                placeholder="Ej. Alex"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Código de Sala
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={8}
                  placeholder="Ej. ABCD"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  required
                  className="flex-1 px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm font-mono uppercase tracking-widest text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="px-4 py-2.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition cursor-pointer shadow-sm"
                >
                  Generar
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer active:scale-[0.99]"
            >
              Establecer Conexión
            </button>

            <div className="relative my-2 flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                o bien
              </span>
              <div className="border-t border-slate-800 w-full" />
            </div>

            <button
              type="button"
              onClick={onSwitchToLocal}
              className="w-full py-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700/80 transition cursor-pointer shadow-sm"
            >
              Jugar en Modo Local (Pass & Play)
            </button>
          </form>
        ) : (
          /* VISTA 2: Sala de espera con jugadores conectados */
          <div className="flex flex-col gap-5">
            <div className={`flex items-center justify-between p-3.5 ${THEME.layout.panelInner} rounded-xl`}>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  Código de Sala
                </span>
                <span className="text-xl font-mono font-extrabold tracking-widest text-indigo-400">
                  {roomData.roomId}
                </span>
              </div>
              <span className="px-3 py-1 text-xs font-mono font-bold bg-slate-800/90 text-slate-300 rounded-lg border border-slate-700">
                {roomData.players.length} / 4 Conectados
              </span>
            </div>

            {/* Lista de jugadores en la sala */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Escuadrón en Sala
              </span>
              <div className="flex flex-col gap-2">
                {roomData.players.map((player) => {
                  const playerTheme = PLAYER_THEME_MAP[player.color];
                  const isMe = player.id === myPlayerId;
                  return (
                    <div
                      key={player.socketId}
                      className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl shadow-inner"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm text-slate-200">
                          {player.name}
                        </span>
                        {isMe && (
                          <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Tú
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${playerTheme.badge} ${playerTheme.glow}`}
                      >
                        {playerTheme.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botón de inicio (disponible desde 2 jugadores) */}
            {myPlayerId === 1 ? (
              <button
                onClick={() => onStartGame(roomData.roomId)}
                disabled={roomData.players.length < 2}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-800 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/30 border border-emerald-500/30"
              >
                {roomData.players.length < 2
                  ? 'Esperando al menos 2 jugadores...'
                  : 'Iniciar Operación'}
              </button>
            ) : (
              <p className="text-center text-xs text-indigo-400 font-mono animate-pulse py-2">
                Esperando a que el comandante (Jugador 1) inicie...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};