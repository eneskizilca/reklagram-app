'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Calendar,
  Filter,
  Download,
  ArrowUp,
  ArrowDown,
  Briefcase,
  LogOut,
  ChevronDown,
  Eye
} from 'lucide-react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

// Mock Data (gerçek API'den gelecek)
const revenueData = [
  { month: 'Oca', revenue: 45000, spent: 12000 },
  { month: 'Şub', revenue: 52000, spent: 15000 },
  { month: 'Mar', revenue: 48000, spent: 13000 },
  { month: 'Nis', revenue: 61000, spent: 18000 },
  { month: 'May', revenue: 75000, spent: 22000 },
  { month: 'Haz', revenue: 88000, spent: 25000 },
];

const platformData = [
  { name: 'Instagram', value: 45, color: '#E1306C' },
  { name: 'YouTube', value: 30, color: '#FF0000' },
  { name: 'TikTok', value: 25, color: '#000000' },
];

const collaborationsHistory = [
  {
    id: 1,
    influencer: 'Ayşe Yılmaz',
    campaign: 'Yaz Koleksiyonu 2024',
    platform: 'Instagram',
    startDate: '2024-01-15',
    endDate: '2024-01-30',
    amountPaid: 25000,
    revenue: 85000,
    roi: 240,
    status: 'completed',
    reach: 125000,
    engagement: 5.8
  },
  {
    id: 2,
    influencer: 'Mehmet Kaya',
    campaign: 'Teknoloji İnceleme',
    platform: 'YouTube',
    startDate: '2024-02-10',
    endDate: '2024-02-25',
    amountPaid: 18000,
    revenue: 62000,
    roi: 244,
    status: 'completed',
    reach: 89000,
    engagement: 4.2
  },
  {
    id: 3,
    influencer: 'Zeynep Demir',
    campaign: 'Fitness Challenge',
    platform: 'Instagram',
    startDate: '2024-03-05',
    endDate: '2024-03-20',
    amountPaid: 32000,
    revenue: 110000,
    roi: 244,
    status: 'completed',
    reach: 200000,
    engagement: 6.3
  },
  {
    id: 4,
    influencer: 'Can Özkan',
    campaign: 'Restoran Tanıtımı',
    platform: 'TikTok',
    startDate: '2024-04-12',
    endDate: '2024-04-27',
    amountPaid: 15000,
    revenue: 48000,
    roi: 220,
    status: 'completed',
    reach: 75000,
    engagement: 7.1
  },
  {
    id: 5,
    influencer: 'Elif Arslan',
    campaign: 'Seyahat Rehberi',
    platform: 'Instagram',
    startDate: '2024-05-08',
    endDate: 'Devam ediyor',
    amountPaid: 28000,
    revenue: 0,
    roi: 0,
    status: 'active',
    reach: 150000,
    engagement: 5.4
  },
];

export default function BrandAnalytics() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    const email = localStorage.getItem('user_email');

    if (!token || role !== 'brand') {
      router.push('/login');
      return;
    }

    if (email) {
      const name = email.split('@')[0];
      setCompanyName(name.charAt(0).toUpperCase() + name.slice(1));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  // Hesaplamalar
  const totalSpent = collaborationsHistory
    .filter(c => c.status === 'completed')
    .reduce((acc, c) => acc + c.amountPaid, 0);
  
  const totalRevenue = collaborationsHistory
    .filter(c => c.status === 'completed')
    .reduce((acc, c) => acc + c.revenue, 0);
  
  const averageROI = totalSpent > 0 ? Math.round(((totalRevenue - totalSpent) / totalSpent) * 100) : 0;
  
  const activeCollaborations = collaborationsHistory.filter(c => c.status === 'active').length;

  // Filtrele
  const filteredCollaborations = selectedStatus === 'all' 
    ? collaborationsHistory 
    : collaborationsHistory.filter(c => c.status === selectedStatus);

  return (
    <div className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-[#F8F9FD] dark:bg-slate-900`}>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/brand/home" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] bg-clip-text text-transparent font-jakarta">
                Reklagram
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 font-inter">
              <Link href="/brand/explore" className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors">
                Keşfet
              </Link>
              <Link href="/brand/collaborations" className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors">
                İşbirlikleri
              </Link>
              <Link href="/brand/analytics" className="text-[#1A2A6C] dark:text-white hover:text-[#7C3AED] dark:hover:text-[#A78BFA] font-semibold transition-colors border-b-2 border-[#1A2A6C] dark:border-white pb-1">
                Analitikler
              </Link>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white hover:shadow-lg transition-all"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {companyName.charAt(0)}
                </div>
                <span className="font-semibold font-jakarta">{companyName}</span>
              </button>

              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                >
                  <Link
                    href="/brand/profile"
                    className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-inter text-gray-700 dark:text-gray-300"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Profilim</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors font-inter"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#1A2A6C] dark:text-white font-jakarta mb-2">
            📊 Analitikler & Raporlar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-inter">
            İşbirliklerinizden elde edilen gelirleri ve ROI'yi takip edin
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
                <ArrowUp className="w-4 h-4 mr-1" />
                12%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-jakarta mb-1">
              ₺{totalSpent.toLocaleString('tr-TR')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-inter">Toplam Harcama</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
                <ArrowUp className="w-4 h-4 mr-1" />
                24%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-jakarta mb-1">
              ₺{totalRevenue.toLocaleString('tr-TR')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-inter">Toplam Gelir</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
                <ArrowUp className="w-4 h-4 mr-1" />
                8%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-jakarta mb-1">
              %{averageROI}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-inter">Ortalama ROI</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="flex items-center text-orange-600 dark:text-orange-400 text-sm font-semibold">
                {activeCollaborations} aktif
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-jakarta mb-1">
              {collaborationsHistory.length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-inter">Toplam İşbirliği</p>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-jakarta">
                Gelir Analizi
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Son 6 Ay</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Gelir" />
                <Line type="monotone" dataKey="spent" stroke="#EF4444" strokeWidth={3} name="Harcama" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Platform Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-jakarta mb-6">
              Platform Dağılımı
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {platformData.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                      {platform.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    %{platform.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Collaborations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-jakarta">
                Geçmiş İşbirlikleri
              </h3>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 border-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tüm Durum</option>
                  <option value="active">Aktif</option>
                  <option value="completed">Tamamlandı</option>
                </select>
                <button className="px-4 py-2 bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Dışa Aktar</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Influencer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Kampanya
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Ödenen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Gelir
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    ROI
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Aksiyon
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredCollaborations.map((collab, index) => (
                  <motion.tr
                    key={collab.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {collab.influencer.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {collab.influencer}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {collab.reach.toLocaleString()} erişim
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {collab.campaign}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                        {collab.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {collab.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 dark:text-red-400">
                      ₺{collab.amountPaid.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                      {collab.revenue > 0 ? `₺${collab.revenue.toLocaleString('tr-TR')}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {collab.roi > 0 ? (
                        <span className="flex items-center text-sm font-bold text-green-600 dark:text-green-400">
                          <ArrowUp className="w-4 h-4 mr-1" />
                          %{collab.roi}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          collab.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}
                      >
                        {collab.status === 'completed' ? 'Tamamlandı' : 'Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Detay</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
