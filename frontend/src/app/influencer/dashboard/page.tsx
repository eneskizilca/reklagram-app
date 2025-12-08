'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock Data - API hata verirse kullanılacak
const mockData = {
  username: "fubet.firat",
  display_name: "FÜBET FIRAT",
  followers: 1540,
  engagement_rate: 4.8,
  reach: 12000,
  growth_history: [
    { date: '1 Ekim', followers: 1400 },
    { date: '10 Ekim', followers: 1450 },
    { date: '20 Ekim', followers: 1500 },
    { date: 'Bugün', followers: 1540 },
  ],
  demographics: [
    { name: '18-24', value: 65 },
    { name: '25-34', value: 25 },
    { name: '35+', value: 10 },
  ]
};

interface InfluencerStats {
  username: string;
  display_name: string;
  followers: number;
  engagement_rate: number;
  reach: number;
  growth_history: Array<{ date: string; followers: number }>;
  demographics: Array<{ name: string; value: number }>;
}

export default function InfluencerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<InfluencerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Token kontrolü
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

        setUserName(email || 'Influencer');

        // API'den veri çekme
        try {
          const response = await axios.get('http://localhost:8000/influencer/me/stats', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setStats(response.data);
        } catch (apiError) {
          // API hata verirse mock data kullan
          console.warn('API hatası, mock data kullanılıyor:', apiError);
          setStats(mockData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
        // Hata durumunda mock data kullan
        setStats(mockData);
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    router.push('/login');
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ReklaGram
                </h1>
                <p className="text-xs text-gray-500">Influencer Paneli</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-500">Hoşgeldin,</p>
                <p className="text-sm font-semibold text-gray-900">{stats.display_name || userName}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
              >
                <span>🚪</span>
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Toplam Takipçi */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Toplam Takipçi</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.followers)}</p>
              </div>
              <div className="bg-linear-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                <span className="text-4xl">👥</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm">
              <span className="mr-1">📈</span>
              <span className="font-semibold">+12.5%</span>
              <span className="text-gray-500 ml-1">bu ay</span>
            </div>
          </div>

          {/* Etkileşim Oranı */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Etkileşim Oranı</p>
                <p className="text-3xl font-bold text-gray-900">{stats.engagement_rate}%</p>
              </div>
              <div className="bg-linear-to-br from-pink-500 to-pink-600 p-3 rounded-xl">
                <span className="text-4xl">❤️</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm">
              <span className="mr-1">📈</span>
              <span className="font-semibold">+0.8%</span>
              <span className="text-gray-500 ml-1">bu ay</span>
            </div>
          </div>

          {/* Aylık Erişim */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Aylık Erişim</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.reach)}</p>
              </div>
              <div className="bg-linear-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                <span className="text-4xl">👁️</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm">
              <span className="mr-1">📈</span>
              <span className="font-semibold">+18.2%</span>
              <span className="text-gray-500 ml-1">bu ay</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Growth Chart - 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <span className="text-xl">📈</span>
              </div>
              Son 30 Günlük Takipçi Değişimi
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.growth_history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#e5e7eb"
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#e5e7eb"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="followers" 
                  stroke="#9333ea" 
                  strokeWidth={3}
                  dot={{ fill: '#9333ea', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Takipçi Sayısı"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Demographics Chart - 1/3 width */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <div className="bg-pink-100 p-2 rounded-lg mr-3">
                <span className="text-xl">👥</span>
              </div>
              Kitle Analizi
            </h3>
            <p className="text-sm text-gray-500 mb-4">Yaş Dağılımı</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.demographics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#e5e7eb"
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#e5e7eb"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#ec4899" 
                  radius={[8, 8, 0, 0]}
                  name="Yüzde (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button className="bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 transform duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <span className="text-3xl">📄</span>
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-bold">Media Kit&apos;imi Güncelle</h4>
                  <p className="text-sm text-purple-100">Portföyünü düzenle ve paylaş</p>
                </div>
              </div>
              <div className="text-white">→</div>
            </div>
          </button>

          <button className="bg-white border-2 border-purple-200 text-gray-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:border-purple-400 hover:scale-105 transform duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <span className="text-3xl">👤</span>
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-bold">Profili Görüntüle</h4>
                  <p className="text-sm text-gray-500">Genel profilini incele</p>
                </div>
              </div>
              <div className="text-purple-600">→</div>
            </div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-md border border-gray-100">
            <p className="text-gray-600 text-sm">
              💡 <span className="font-semibold">İpucu:</span> Profilinizi düzenli güncelleyerek daha fazla işbirliği fırsatı yakalayın!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
