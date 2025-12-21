'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  timestamp: string;
  formatted_timestamp: string;
  is_read: boolean;
}

interface ChatWindowProps {
  currentUserId: number;
  otherUserId: number;
  otherUserName: string;
  token: string;
}

export default function ChatWindow({
  currentUserId,
  otherUserId,
  otherUserName,
  token,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages function
  const fetchMessages = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get<Message[]>(`/messages/${otherUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      if (err.response?.status !== 401) {
        setError('Mesajlar yüklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  }, [otherUserId, token]);

  // Polling: Fetch messages every 3 seconds
  useEffect(() => {
    // Initial fetch
    setLoading(true);
    fetchMessages();

    // Set up polling interval
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Send message function
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);
    setError(null);

    try {
      await api.post(
        '/messages/',
        {
          receiver_id: otherUserId,
          content: messageContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch updated messages immediately after sending
      await fetchMessages();
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError('Mesaj gönderilirken bir hata oluştu');
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes} dk önce`;
    if (hours < 24) return `${hours} sa önce`;
    if (days < 7) return `${days} gün önce`;
    
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {otherUserName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-white font-bold text-xl font-sans">{otherUserName}</h2>
            <p className="text-white/80 text-sm">
              {messages.length > 0 ? 'Aktif' : 'Yeni konuşma'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin"
        style={{ maxHeight: 'calc(100vh - 280px)' }}
      >
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Henüz mesaj yok. İlk mesajınızı gönderin!
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => {
              const isMe = message.sender_id === currentUserId;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-3 shadow-lg ${
                      isMe
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600'
                    }`}
                  >
                    <p className="text-sm break-words">{message.content}</p>
                    <div className={`flex items-center justify-end mt-1 space-x-1 ${
                      isMe ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <span className="text-xs">{formatTime(message.timestamp)}</span>
                      {isMe && message.is_read && (
                        <span className="text-xs">✓✓</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200 px-4 py-2 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-gray-200 dark:border-slate-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            disabled={sending}
            maxLength={5000}
          />
          <motion.button
            type="submit"
            disabled={!newMessage.trim() || sending}
            whileHover={{ scale: sending ? 1 : 1.05 }}
            whileTap={{ scale: sending ? 1 : 0.95 }}
            className={`p-3 rounded-xl shadow-lg transition-all ${
              newMessage.trim() && !sending
                ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:shadow-indigo-500/50'
                : 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Mesajlar her 3 saniyede bir otomatik güncellenir
        </p>
      </div>
    </div>
  );
}

