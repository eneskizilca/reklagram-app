'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import api from '@/lib/api';
import type { User } from '@/types/auth';
import { Loader2, MessageSquare } from 'lucide-react';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [otherUserId, setOtherUserId] = useState<number | null>(null);
  const [otherUserName, setOtherUserName] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      // Try user's specified localStorage keys first, then fallback to actual pattern
      let storedToken = localStorage.getItem('token') || localStorage.getItem('access_token');
      let storedUserStr = localStorage.getItem('user');

      // If user object is stored as JSON string, parse it
      let storedUser: User | null = null;
      if (storedUserStr) {
        try {
          storedUser = JSON.parse(storedUserStr);
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }

      // If no token found, redirect to login
      if (!storedToken) {
        router.push('/login');
        return;
      }

      setToken(storedToken);

      // If user object is not in localStorage, fetch from API
      if (!storedUser) {
        try {
          const response = await api.get<User>('/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          storedUser = response.data;
          // Optionally save to localStorage for future use
          localStorage.setItem('user', JSON.stringify(storedUser));
        } catch (error) {
          console.error('Error fetching user data:', error);
          router.push('/login');
          return;
        }
      }

      setUser(storedUser);

      // Read userId and userName from URL search params
      const userIdParam = searchParams.get('userId');
      const userNameParam = searchParams.get('name') || searchParams.get('userName');

      if (userIdParam && userNameParam) {
        // If URL params exist, use them
        setOtherUserId(parseInt(userIdParam, 10));
        setOtherUserName(userNameParam);
      }
      // If no params, otherUserId and otherUserName remain null
      // This will trigger the empty state

      setIsReady(true);
    };

    initializeChat();
  }, [router, searchParams]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-inter">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-inter">
            Mesajlaşma için giriş yapmanız gerekiyor.
          </p>
        </div>
      </div>
    );
  }

  // Empty state when no user is selected
  if (!otherUserId || !otherUserName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-sans">
              Mesajlarım
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-sans">
              {user.role === 'brand' 
                ? 'Influencer\'lar ile iletişime geçin' 
                : 'Markalar ile iletişime geçin'}
            </p>
          </div>

          {/* Empty State */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="h-[calc(100vh-200px)] min-h-[600px] flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                    <MessageSquare className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-sans">
                  Sohbet Başlatın
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 font-sans">
                  Mesajlaşmaya başlamak için bir kullanıcı seçin veya URL'ye kullanıcı bilgilerini ekleyin.
                </p>
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 text-left">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-mono">
                    <span className="font-semibold">Örnek:</span>
                  </p>
                  <code className="text-xs text-indigo-600 dark:text-indigo-400 break-all">
                    /dashboard/messages?userId=5&name=Ahmet
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat Window when user is selected
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-slate-900">
      {/* Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-sans">
            Mesajlarım
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-sans">
            {user.role === 'brand' 
              ? 'Influencer\'lar ile iletişime geçin' 
              : 'Markalar ile iletişime geçin'}
          </p>
        </div>

        {/* Chat Window Container */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="h-[calc(100vh-200px)] min-h-[600px]">
            <ChatWindow
              currentUserId={user.id}
              otherUserId={otherUserId}
              otherUserName={otherUserName}
              token={token}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-inter">Yükleniyor...</p>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}

