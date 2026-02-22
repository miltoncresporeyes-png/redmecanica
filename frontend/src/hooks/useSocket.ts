import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  userId: string;
  userType: 'CUSTOMER' | 'PROVIDER';
  userName?: string;
  onNewMessage?: (data: { conversationId: string; senderId: string; senderName: string; content: string }) => void;
  onUserOnline?: (data: { userId: string; name: string }) => void;
  onUserOffline?: (data: { userId: string }) => void;
}

export function useSocket(options: UseSocketOptions) {
  const { userId, userType, userName, onNewMessage, onUserOnline, onUserOffline } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    // Derivar la URL del socket de VITE_API_URL (removiendo /api si existe)
    const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3010').replace(/\/api$/, '');
    
    const socket = io(socketUrl, {
      auth: {
        token: userId,
        userId,
        userType,
        userName
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('user:online', (data: { userId: string; name: string }) => {
      setOnlineUsers(prev => new Map(prev).set(data.userId, data.name));
      onUserOnline?.(data);
    });

    socket.on('user:offline', (data: { userId: string }) => {
      setOnlineUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(data.userId);
        return newMap;
      });
      onUserOffline?.(data);
    });

    socket.on('notification:new_message', (data: { conversationId: string; senderId: string; senderName: string; content: string }) => {
      onNewMessage?.(data);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId, userType, userName]);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('join:conversation', conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('leave:conversation', conversationId);
  }, []);

  const sendMessage = useCallback((conversationId: string, content: string, metadata?: Record<string, unknown>) => {
    socketRef.current?.emit('message:send', {
      conversationId,
      content,
      metadata,
      senderType: userType,
    });
  }, [userType]);

  const sendTypingStart = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing:start', conversationId);
  }, []);

  const sendTypingStop = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing:stop', conversationId);
  }, []);

  const shareLocation = useCallback((conversationId: string, lat: number, lng: number) => {
    socketRef.current?.emit('location:share', {
      conversationId,
      lat,
      lng,
    });
  }, []);

  const markAsRead = useCallback((conversationId: string, messageId: string) => {
    socketRef.current?.emit('message:read', {
      conversationId,
      messageId,
    });
  }, []);

  return {
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTypingStart,
    sendTypingStop,
    shareLocation,
    markAsRead,
  };
}
