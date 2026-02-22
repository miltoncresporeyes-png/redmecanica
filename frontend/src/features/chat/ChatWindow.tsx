import React, { useState, useEffect, useRef } from 'react';
import { getConversationById, getConversationMessages, sendMessage, createConversation } from '../../services/api';

interface Message {
  id: string;
  senderId: string;
  senderType: 'CUSTOMER' | 'PROVIDER';
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  jobId?: string;
  customerId: string;
  providerId: string;
  status: string;
  provider: {
    user: { name: string };
  };
}

interface ChatWindowProps {
  conversationId?: string;
  jobId?: string;
  currentUserId: string;
  currentUserType: 'CUSTOMER' | 'PROVIDER';
  providerId?: string;
  onClose?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  jobId,
  currentUserId,
  currentUserType,
  providerId,
  onClose
}) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initChat();
  }, [conversationId, jobId, currentUserId, providerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initChat = async () => {
    try {
      setLoading(true);
      
      let convId = conversationId;
      
      // Si no hay conversationId pero hay jobId, crear o buscar conversación
      if (!convId && jobId && providerId) {
        const newConv = await createConversation({
          jobId,
          customerId: currentUserId,
          providerId
        });
        convId = newConv.id;
      }
      
      if (convId) {
        const conv = await getConversationById(convId);
        setConversation(conv);
        
        const msgs = await getConversationMessages(convId);
        setMessages(msgs);
      }
    } catch (err) {
      setError('Error al cargar el chat');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    try {
      setSending(true);
      const msg = await sendMessage(conversation.id, {
        senderId: currentUserId,
        senderType: currentUserType,
        content: newMessage.trim()
      });
      
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  };

  const otherUserName = conversation?.provider?.user?.name || 'Proveedor';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {otherUserName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{otherUserName}</h3>
            <p className="text-xs text-gray-500">En línea</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg ${
                  isOwn
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? '...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
