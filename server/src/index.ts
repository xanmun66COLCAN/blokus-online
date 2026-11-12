import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { BoardGrid, Move, Piece, PieceShape, PlayerColor, PlayerId } from '@shared/types/blokus';
import { ALL_PIECES } from '@shared/constants/pieces';
import { BOARD_SIZE, isValidMove } from '@shared/engine/validator';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 4000;

interface ServerPlayer {
  socketId: string;
  id: PlayerId;
  name: string;
  color: PlayerColor;
  pieces: Piece[];
  hasPassed: boolean;
}

interface GameRoom {
  roomId: string;
  players: ServerPlayer[];
  board: BoardGrid;
  activeTurnIndex: number;
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
}

const rooms = new Map<string, GameRoom>();

const PLAYER_SLOTS: { id: PlayerId; color: PlayerColor }[] = [
  { id: 1, color: 'BLUE' },
  { id: 2, color: 'YELLOW' },
  { id: 3, color: 'RED' },
  { id: 4, color: 'GREEN' },
];

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  // 1. Unirse o crear una sala
  socket.on('join_room', ({ roomId, playerName }: { roomId: string; playerName: string }) => {
    const cleanRoomId = roomId.trim().toUpperCase();
    socket.join(cleanRoomId);

    if (!rooms.has(cleanRoomId)) {
      rooms.set(cleanRoomId, {
        roomId: cleanRoomId,
        players: [],
        board: Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null)),
        activeTurnIndex: 0,
        status: 'WAITING',
      });
    }

    const room = rooms.get(cleanRoomId)!;

    // Evitar duplicados si el mismo socket reintenta unirse
    const existingPlayer = room.players.find((p) => p.socketId === socket.id);
    if (!existingPlayer) {
      if (room.players.length >= 4) {
        socket.emit('error_message', 'La sala ya está llena (máximo 4 jugadores).');
        return;
      }

      const slot = PLAYER_SLOTS[room.players.length];
      room.players.push({
        socketId: socket.id,
        id: slot.id,
        name: playerName || `Jugador ${slot.id}`,
        color: slot.color,
        pieces: ALL_PIECES.map((p) => ({ ...p })), // Copia fresca de las 21 piezas
        hasPassed: false,
      });

      // Iniciar partida automáticamente al llegar a 4 jugadores (o puedes iniciar antes)
      if (room.players.length === 4) {
        room.status = 'PLAYING';
      }
    }

    io.to(cleanRoomId).emit('room_update', room);
  });

  // 2. Iniciar partida manualmente (útil para probar con 2 o 3 jugadores)
  socket.on('start_game', ({ roomId }: { roomId: string }) => {
    const room = rooms.get(roomId);
    if (!room || room.players.length < 2) return;

    room.status = 'PLAYING';
    io.to(roomId).emit('room_update', room);
  });

  // 3. Recibir y validar una jugada
  socket.on(
    'place_piece',
    ({
      roomId,
      pieceId,
      shape,
      row,
      col,
    }: {
      roomId: string;
      pieceId: number;
      shape: PieceShape;
      row: number;
      col: number;
    }) => {
      const room = rooms.get(roomId);
      if (!room || room.status !== 'PLAYING') return;

      const activePlayer = room.players[room.activeTurnIndex];

      // Verificar identidad y turno
      if (!activePlayer || activePlayer.socketId !== socket.id) {
        socket.emit('error_message', 'No es tu turno.');
        return;
      }

      // Verificar que el jugador aún tenga la pieza disponible
      const pieceIndex = activePlayer.pieces.findIndex((p) => p.id === pieceId);
      if (pieceIndex === -1) {
        socket.emit('error_message', 'Ya utilizaste esa pieza.');
        return;
      }

      const isFirstMove = activePlayer.pieces.length === 21;
      const move: Move = {
        playerId: activePlayer.id,
        pieceId,
        shape,
        row,
        col,
      };

      // Validación autoritativa usando el motor compartido
      if (!isValidMove(room.board, move, isFirstMove)) {
        socket.emit('error_message', 'Movimiento inválido según las reglas de Blokus.');
        return;
      }

      // Aplicar la pieza al tablero del servidor
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[0].length; c++) {
          if (shape[r][c] === 1) {
            room.board[row + r][col + c] = activePlayer.id;
          }
        }
      }

      // Eliminar la pieza usada del inventario del jugador
      activePlayer.pieces.splice(pieceIndex, 1);

      // Avanzar al siguiente jugador
      room.activeTurnIndex = (room.activeTurnIndex + 1) % room.players.length;

      // Sincronizar el nuevo estado con todos en la sala
      io.to(roomId).emit('room_update', room);
    }
  );

  // 4. Pasar turno
  socket.on('pass_turn', ({ roomId }: { roomId: string }) => {
    const room = rooms.get(roomId);
    if (!room || room.status !== 'PLAYING') return;

    const activePlayer = room.players[room.activeTurnIndex];
    if (!activePlayer || activePlayer.socketId !== socket.id) return;

    activePlayer.hasPassed = true;
    room.activeTurnIndex = (room.activeTurnIndex + 1) % room.players.length;

    // Si todos pasaron, finalizar la partida
    if (room.players.every((p) => p.hasPassed)) {
      room.status = 'FINISHED';
    }

    io.to(roomId).emit('room_update', room);
  });

  // 5. Desconexión
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    rooms.forEach((room, roomId) => {
      const idx = room.players.findIndex((p) => p.socketId === socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          room.activeTurnIndex = room.activeTurnIndex % room.players.length;
          io.to(roomId).emit('room_update', room);
        }
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Servidor autoritativo de Blokus corriendo en http://localhost:${PORT}`);
});