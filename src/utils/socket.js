import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const initializeSocket = (userId) => {
  const socket = io(SOCKET_URL, {
    query: {
      userId
    }
  });

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};