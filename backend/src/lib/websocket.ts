import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { prisma } from '../db.js';

interface AuthenticatedSocket extends Socket {
  userId: string;
  userType: 'CUSTOMER' | 'PROVIDER';
}

export function setupWebSocket(httpServer: HttpServer): SocketServer {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const connectedUsers = new Map<string, AuthenticatedSocket>();

  io.use(async (socket, next) => {
    try {
      const userId = socket.handshake.auth.userId as string;
      const userType = socket.handshake.auth.userType as 'CUSTOMER' | 'PROVIDER' | undefined;

      if (!userId) {
        return next(new Error('Authentication error'));
      }

      (socket as AuthenticatedSocket).userId = userId;
      (socket as AuthenticatedSocket).userType = userType || 'CUSTOMER';

      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userSocket = socket as AuthenticatedSocket;
    const { userId, userType } = userSocket;

    console.log(`User connected: ${userId} (${userType})`);
    connectedUsers.set(userId, userSocket);

    const fetchUserData = async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true }
        });

        if (user) {
          socket.broadcast.emit('user:online', { userId: user.id, name: user.name });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();

    socket.on('join:conversation', async (conversationId: string) => {
      try {
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          select: { customerId: true, providerId: true }
        });

        if (!conversation) {
          return socket.emit('error', { message: 'Conversation not found' });
        }

        if (conversation.customerId !== userId && conversation.providerId !== userId) {
          return socket.emit('error', { message: 'Not authorized' });
        }

        socket.join(`conversation:${conversationId}`);
        console.log(`User ${userId} joined conversation ${conversationId}`);
      } catch (error) {
        console.error('Error joining conversation:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    socket.on('message:send', async (data: {
      conversationId: string;
      content: string;
      metadata?: Record<string, unknown>;
    }) => {
      try {
        const { conversationId, content, metadata } = data;

        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          select: { customerId: true, providerId: true }
        });

        if (!conversation) {
          return socket.emit('error', { message: 'Conversation not found' });
        }

        if (conversation.customerId !== userId && conversation.providerId !== userId) {
          return socket.emit('error', { message: 'Not authorized' });
        }

        const senderType = userType === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';

        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: userId,
            senderType,
            content,
            metadata: metadata ? JSON.stringify(metadata) : null,
          },
          include: { conversation: true }
        });

        await prisma.conversation.update({
          where: { id: conversationId },
          data: { lastMessageAt: new Date() }
        });

        io.to(`conversation:${conversationId}`).emit('message:received', {
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          senderType: message.senderType,
          content: message.content,
          createdAt: message.createdAt,
        });

        const recipientId = senderType === 'CUSTOMER' ? conversation.providerId : conversation.customerId;
        const recipientSocket = connectedUsers.get(recipientId);

        if (recipientSocket) {
          recipientSocket.emit('notification:new_message', {
            conversationId,
            senderId: userId,
            senderName: socket.handshake.auth.userName || 'Usuario',
            content: content.substring(0, 50),
          });
        } else {
          await prisma.notification.create({
            data: {
              userId: recipientId,
              type: 'MESSAGE',
              title: 'Nuevo mensaje',
              body: content.substring(0, 100),
              data: JSON.stringify({ conversationId, messageId: message.id }),
            }
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('message:read', async (data: { conversationId: string; messageId: string }) => {
      try {
        const { conversationId, messageId } = data;

        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          select: { customerId: true, providerId: true }
        });

        if (!conversation) return;

        const message = await prisma.message.update({
          where: { id: messageId },
          data: { isRead: true }
        });

        io.to(`conversation:${conversationId}`).emit('message:read', {
          messageId,
          readAt: new Date(),
        });

        const senderId = message.senderId;
        const senderSocket = connectedUsers.get(senderId);

        if (senderSocket) {
          senderSocket.emit('message:delivered', { messageId });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    socket.on('typing:start', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('typing:started', {
        conversationId,
        userId,
        userType,
      });
    });

    socket.on('typing:stop', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stopped', {
        conversationId,
        userId,
      });
    });

    socket.on('location:share', async (data: {
      conversationId: string;
      lat: number;
      lng: number;
    }) => {
      try {
        const { conversationId, lat, lng } = data;

        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          select: { customerId: true, providerId: true }
        });

        if (!conversation || (conversation.customerId !== userId && conversation.providerId !== userId)) {
          return;
        }

        io.to(`conversation:${conversationId}`).emit('location:received', {
          userId,
          lat,
          lng,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Error sharing location:', error);
      }
    });

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${userId}`);
      connectedUsers.delete(userId);

      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true }
        });

        if (user) {
          socket.broadcast.emit('user:offline', { userId: user.id });
        }
      } catch (error) {
        console.error('Error on disconnect:', error);
      }
    });
  });

  return io;
}

export function getIO(): SocketServer | null {
  const httpServer = (global as unknown as { httpServer: HttpServer }).httpServer;
  if (!httpServer) return null;
  return null;
}
