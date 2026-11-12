import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { BoardGrid, Piece, PieceShape, PlayerColor, PlayerId } from '@shared/types/blokus';
import { BOARD_SIZE } from '@shared/engine/validator';

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

const SOCKET_URL = 'http://localhost:4000';

export function useBlokusOnline() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomData, setRoomData] = useState<GameRoom | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<PlayerId | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [selectedShape, setSelectedShape] = useState<PieceShape | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('room_update', (room: GameRoom) => {
      setRoomData(room);
      setErrorMessage(null);

      // Identificar qué jugador soy basado en mi socket.id
      const me = room.players.find((p) => p.socketId === newSocket.id);
      if (me) {
        setMyPlayerId(me.id);
      }
    });

    newSocket.on('error_message', (msg: string) => {
      setErrorMessage(msg);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = (roomId: string, playerName: string) => {
    if (socket) {
      socket.emit('join_room', { roomId, playerName });
    }
  };

  const startGame = (roomId: string) => {
    if (socket) {
      socket.emit('start_game', { roomId });
    }
  };

  const handleSelectPiece = (piece: Piece) => {
    setSelectedPiece(piece);
    setSelectedShape(piece.shape);
  };

  const handleUpdateShape = (newShape: PieceShape) => {
    setSelectedShape(newShape);
  };

  const placePiece = useCallback(
    (row: number, col: number) => {
      if (!socket || !roomData || !selectedPiece || !selectedShape) return;

      socket.emit('place_piece', {
        roomId: roomData.roomId,
        pieceId: selectedPiece.id,
        shape: selectedShape,
        row,
        col,
      });

      // Limpiar selección local al enviar
      setSelectedPiece(null);
      setSelectedShape(null);
    },
    [socket, roomData, selectedPiece, selectedShape]
  );

  const passTurn = () => {
    if (!socket || !roomData) return;
    socket.emit('pass_turn', { roomId: roomData.roomId });
    setSelectedPiece(null);
    setSelectedShape(null);
  };

  return {
    socket,
    roomData,
    myPlayerId,
    errorMessage,
    selectedPiece,
    selectedShape,
    joinRoom,
    startGame,
    handleSelectPiece,
    handleUpdateShape,
    placePiece,
    passTurn,
  };
}