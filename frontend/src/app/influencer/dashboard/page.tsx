'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InfluencerDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check if user is logged in and has the right role
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    const email = localStorage.getItem('user_email');

    if (!token) {
      router.push('/login');
      return;
    }

    if (role !== 'influencer') {
      router.push('/login');
      return;
    }

    setUserEmail(email || '');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-purple-600">ReklaGram</h1>
            <span className="text-sm text-gray-500">Influencer Panel</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Hoş Geldiniz, Influencer!
            </h2>
            <p className="text-gray-600 mb-8">
              ReklaGram Influencer Dashboard'a hoş geldiniz
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-lg font-semibold text-gray-900">İstatistikler</h3>
              <p className="text-gray-600 text-sm mt-2">
                Profil analitiğinizi görüntüleyin
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="text-lg font-semibold text-gray-900">İşbirlikleri</h3>
              <p className="text-gray-600 text-sm mt-2">
                Aktif kampanyalarınız
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-lg font-semibold text-gray-900">Kazançlar</h3>
              <p className="text-gray-600 text-sm mt-2">
                Toplam gelir
              </p>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-3 rounded-full">
              <p className="text-purple-900 font-semibold">
                🚀 Daha fazla özellik yakında...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

