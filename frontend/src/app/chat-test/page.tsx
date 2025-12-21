'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import api from '@/lib/api';
import type { User } from '@/types/auth';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

export default function ChatTestPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [otherUserId, setOtherUserId] = useState<number>(2);
  const [otherUserName, setOtherUserName] = useState<string>('Test User');
  const [token, setToken] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      // Check authentication
      const storedToken = localStorage.getItem('access_token');

      if (!storedToken) {
        router.push('/login');
        return;
      }

      setToken(storedToken);

      try {
        // Fetch current user data from API
        const response = await api.get<User>('/auth/me');
        const user = response.data;
        setCurrentUserId(user.id);
        setIsReady(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If API fails, try to use localStorage fallback
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
          setCurrentUserId(parseInt(storedUserId, 10));
        }
        setIsReady(true);
      }
    };

    fetchUserData();
  }, [router]);

  if (!isReady) {
    return (
      <div className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-[#F8F9FD] dark:bg-slate-900 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-jakarta">
            Chat Test Sayfası
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-inter">
            Mesajlaşma bileşenini test edin
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-jakarta">
            Test Ayarları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-inter">
                Mevcut Kullanıcı ID
              </label>
              <input
                type="number"
                value={currentUserId || ''}
                onChange={(e) => setCurrentUserId(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-inter">
                Diğer Kullanıcı ID
              </label>
              <input
                type="number"
                value={otherUserId}
                onChange={(e) => setOtherUserId(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                placeholder="2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-inter">
                Diğer Kullanıcı Adı
              </label>
              <input
                type="text"
                value={otherUserName}
                onChange={(e) => setOtherUserName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                placeholder="Test User"
              />
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="h-[600px] md:h-[700px]">
          {currentUserId && token ? (
            <ChatWindow
              currentUserId={currentUserId}
              otherUserId={otherUserId}
              otherUserName={otherUserName}
              token={token}
            />
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center border border-gray-200 dark:border-slate-700">
              <p className="text-gray-500 dark:text-gray-400">
                Lütfen giriş yapın ve kullanıcı bilgilerini girin.
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2 font-jakarta">
            ℹ️ Test Bilgileri
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 font-inter">
            <li>• Mesajlar her 3 saniyede bir otomatik olarak güncellenir (polling)</li>
            <li>• Yeni mesajlar geldiğinde otomatik olarak en alta kaydırılır</li>
            <li>• Mesaj göndermek için alttaki input alanını kullanın</li>
            <li>• API endpoint: <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">/messages/{otherUserId}</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

