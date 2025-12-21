'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Users,
  Briefcase,
  TrendingUp,
  Activity,
  LogOut,
  Shield,
  Search,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Building2,
  UserCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import api from '@/lib/api';

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

interface Stats {
  users: {
    total: number;
    brands: number;
    influencers: number;
    new_30d: number;
    new_7d: number;
  };
  collaborations: {
    total: number;
    active: number;
    pending: number;
    completed: number;
  };
}

interface UserData {
  id: number;
  email: string;
  role: string;
  created_at: string;
  company_name?: string;
  name?: string;
  category?: string;
  industry?: string;
}

interface CollaborationData {
  id: number;
  title: string;
  status: string;
  agreed_price: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  brand: {
    id: number;
    company_name: string;
    email: string;
  };
  influencer: {
    id: number;
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [collaborations, setCollaborations] = useState<CollaborationData[]>([]);
  const [selectedTab, setSelectedTab] = useState<'users' | 'collaborations'>('users');
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    // Auth kontrolü
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    const email = localStorage.getItem('user_email');

    if (!token || role !== 'superadmin') {
      router.push('/admin');
      return;
    }

    if (email) {
      setAdminEmail(email);
    }

    // Verileri çek
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Stats
      const statsResponse = await api.get('/admin/dashboard/stats');
      setStats(statsResponse.data);

      // Users
      const usersResponse = await api.get('/admin/users?limit=100');
      setUsers(usersResponse.data.users);

      // Collaborations
      const collabsResponse = await api.get('/admin/collaborations?limit=100');
      setCollaborations(collabsResponse.data.collaborations);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    router.push('/admin');
  };

  const handleDeleteUser = async (userId: number, email: string) => {
    if (!confirm(`${email} kullanıcısını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      alert('Kullanıcı başarıyla silindi');
      fetchData();
    } catch (error) {
      console.error('Kullanıcı silinirken hata:', error);
      alert('Kullanıcı silinirken hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300';
      case 'completed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'brand':
        return <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">Marka</span>;
      case 'influencer':
        return <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">Influencer</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">{role}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-inter">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-[#F8F9FD] dark:bg-slate-900`}>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">
                  SuperAdmin Dashboard
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#1A2A6C] dark:text-white font-jakarta">
                  {adminEmail}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">
                  SuperAdmin
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all font-jakarta"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+{stats?.users.new_7d} / 7 gün</span>
            </div>
            <h3 className="text-3xl font-extrabold mb-1 font-jakarta">{stats?.users.total}</h3>
            <p className="text-blue-100 text-sm font-inter">Toplam Kullanıcı</p>
          </motion.div>

          {/* Brands */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold mb-1 font-jakarta">{stats?.users.brands}</h3>
            <p className="text-purple-100 text-sm font-inter">Marka</p>
          </motion.div>

          {/* Influencers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <UserCircle2 className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold mb-1 font-jakarta">{stats?.users.influencers}</h3>
            <p className="text-pink-100 text-sm font-inter">Influencer</p>
          </motion.div>

          {/* Collaborations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{stats?.collaborations.active} aktif</span>
            </div>
            <h3 className="text-3xl font-extrabold mb-1 font-jakarta">{stats?.collaborations.total}</h3>
            <p className="text-green-100 text-sm font-inter">İşbirliği</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="flex border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedTab('users')}
              className={`flex-1 px-6 py-4 font-bold font-jakarta transition-all ${
                selectedTab === 'users'
                  ? 'bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              Kullanıcılar ({users.length})
            </button>
            <button
              onClick={() => setSelectedTab('collaborations')}
              className={`flex-1 px-6 py-4 font-bold font-jakarta transition-all ${
                selectedTab === 'collaborations'
                  ? 'bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              İşbirlikleri ({collaborations.length})
            </button>
          </div>

          {/* Users Table */}
          {selectedTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-jakarta">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-jakarta">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-jakarta">
                      Kayıt Tarihi
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-jakarta">
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {users.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white font-jakarta">
                            {user.company_name || user.name || user.email.split('@')[0]}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-inter">
                          {new Date(user.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role !== 'superadmin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-inter text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Sil</span>
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Collaborations Table */}
          {selectedTab === 'collaborations' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-jakarta">
                      İşbirliği
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-jakarta">
                      Durum
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-jakarta">
                      Fiyat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-jakarta">
                      Oluşturulma
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {collaborations.map((collab) => (
                    <motion.tr
                      key={collab.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white font-jakarta">
                            {collab.title || 'Başlıksız'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">
                            {collab.brand.company_name} → {collab.influencer.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(collab.status)}`}>
                          {collab.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-inter">
                          {collab.agreed_price ? `₺${collab.agreed_price.toLocaleString('tr-TR')}` : '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-inter">
                          {new Date(collab.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
