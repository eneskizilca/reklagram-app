'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Briefcase, 
  LogOut,
  Menu,
  X as CloseIcon,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Edit,
  Filter,
  ChevronDown,
  Sparkles
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

interface Collaboration {
  id: number;
  brand_id: number;
  influencer_id: number;
  title: string;
  brief: string;
  agreed_price: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  influencer_name: string;
  influencer_avatar?: string;
}

export default function BrandCollaborations() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    // Auth kontrolü
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    const email = localStorage.getItem('user_email');

    if (!token || role !== 'brand') {
      router.push('/login');
      return;
    }

    // Email'den şirket ismi çıkar
    if (email) {
      const name = email.split('@')[0];
      setCompanyName(name.charAt(0).toUpperCase() + name.slice(1));
    }

    // İşbirlikleri getir
    fetchCollaborations();
  }, [router]);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/collaborations/my-collaborations');
      setCollaborations(response.data);
      if (response.data.length > 0) {
        setSelectedCollaboration(response.data[0]);
      }
    } catch (error) {
      console.error('İşbirlikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    router.push('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Beklemede';
    }
  };

  const filteredCollaborations = collaborations.filter(collab => {
    const matchesSearch = collab.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collab.influencer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || collab.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <Link href="/brand/home" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/reklagram-logo.png"
                  alt="ReklaGram"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                ReklaGram
              </span>
            </Link>

            {/* Desktop Menu Items */}
            <div className="hidden md:flex items-center space-x-6 font-inter">
              <Link 
                href="/brand/explore"
                className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors"
              >
                Influencer Keşfet
              </Link>
              <Link 
                href="/brand/campaigns"
                className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors"
              >
                Kampanyalarım
              </Link>
              <Link 
                href="/brand/collaborations"
                className="text-[#1A2A6C] dark:text-white hover:text-[#7C3AED] dark:hover:text-[#A78BFA] font-semibold transition-colors border-b-2 border-[#1A2A6C] dark:border-white pb-1"
              >
                İşbirliklerim
              </Link>
            </div>

            {/* Profile Menu */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
              >
                {showMobileMenu ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="relative profile-menu-container">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white hover:shadow-lg transition-all"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    {companyName.charAt(0)}
                  </div>
                  <span className="font-semibold font-jakarta hidden sm:inline">{companyName}</span>
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
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-slate-700"
          >
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/brand/explore"
                onClick={() => setShowMobileMenu(false)}
                className="flex px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium font-inter"
              >
                Influencer Keşfet
              </Link>
              <Link
                href="/brand/campaigns"
                onClick={() => setShowMobileMenu(false)}
                className="flex px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium font-inter"
              >
                Kampanyalarım
              </Link>
              <Link
                href="/brand/collaborations"
                onClick={() => setShowMobileMenu(false)}
                className="flex px-4 py-3 text-[#1A2A6C] dark:text-white bg-gray-100 dark:bg-slate-700 rounded-lg font-semibold font-inter"
              >
                İşbirliklerim
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Briefcase className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A2A6C] dark:text-white font-jakarta">
              İşbirliklerim
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-inter">
            Influencer işbirliklerini takip et ve yönet
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="İşbirliği ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter"
            />
          </div>

          {/* Modern Status Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50 transition-all font-jakarta group"
            >
              <Filter className="w-5 h-5" />
              <span>
                {statusFilter === 'all' && 'Tüm Durumlar'}
                {statusFilter === 'pending' && 'Beklemede'}
                {statusFilter === 'active' && 'Aktif'}
                {statusFilter === 'completed' && 'Tamamlandı'}
                {statusFilter === 'cancelled' && 'İptal Edildi'}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden z-50"
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-inter ${
                        statusFilter === 'all'
                          ? 'bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white shadow-lg'
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">Tüm Durumlar</div>
                        <div className="text-xs opacity-70">Hepsini göster</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setStatusFilter('pending');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-inter ${
                        statusFilter === 'pending'
                          ? 'bg-yellow-500 text-white shadow-lg'
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">Beklemede</div>
                        <div className="text-xs opacity-70">Onay bekleyen</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setStatusFilter('active');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-inter ${
                        statusFilter === 'active'
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">Aktif</div>
                        <div className="text-xs opacity-70">Devam eden</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setStatusFilter('completed');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-inter ${
                        statusFilter === 'completed'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">Tamamlandı</div>
                        <div className="text-xs opacity-70">Başarıyla bitti</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setStatusFilter('cancelled');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-inter ${
                        statusFilter === 'cancelled'
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">İptal Edildi</div>
                        <div className="text-xs opacity-70">Sonlandırıldı</div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Collaborations Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                  İşbirlikler ({filteredCollaborations.length})
                </h2>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(100vh-350px)]">
                {loading ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    Yükleniyor...
                  </div>
                ) : filteredCollaborations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-inter">Henüz işbirliği yok</p>
                  </div>
                ) : (
                  filteredCollaborations.map((collab) => (
                    <motion.button
                      key={collab.id}
                      onClick={() => setSelectedCollaboration(collab)}
                      whileHover={{ scale: 1.02 }}
                      className={`w-full p-4 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all text-left ${
                        selectedCollaboration?.id === collab.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500'
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-[#1A2A6C] dark:text-white font-jakarta line-clamp-1">
                          {collab.title || 'Başlıksız İşbirliği'}
                        </h3>
                        <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(collab.status)}`}>
                          {getStatusIcon(collab.status)}
                          <span>{getStatusText(collab.status)}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mb-2">
                        {collab.influencer_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-inter">
                        {new Date(collab.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden"
            >
              {selectedCollaboration ? (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold font-jakarta mb-2">
                          {selectedCollaboration.title || 'Başlıksız İşbirliği'}
                        </h2>
                        <p className="text-white/80 font-inter">
                          {selectedCollaboration.influencer_name}
                        </p>
                      </div>
                      <span className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm`}>
                        {getStatusIcon(selectedCollaboration.status)}
                        <span>{getStatusText(selectedCollaboration.status)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-inter">Anlaşılan Ücret</span>
                        </div>
                        <p className="text-xl font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                          {selectedCollaboration.agreed_price ? `₺${parseFloat(selectedCollaboration.agreed_price).toLocaleString('tr-TR')}` : 'Belirtilmedi'}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-inter">Süre</span>
                        </div>
                        <p className="text-sm font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                          {selectedCollaboration.start_date && selectedCollaboration.end_date
                            ? `${new Date(selectedCollaboration.start_date).toLocaleDateString('tr-TR')} - ${new Date(selectedCollaboration.end_date).toLocaleDateString('tr-TR')}`
                            : 'Belirtilmedi'}
                        </p>
                      </div>
                    </div>

                    {/* Brief */}
                    {selectedCollaboration.brief && (
                      <div>
                        <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-3 font-jakarta flex items-center space-x-2">
                          <AlertCircle className="w-5 h-5" />
                          <span>İşbirliği Detayları</span>
                        </h3>
                        <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                          <p className="text-gray-700 dark:text-gray-300 font-inter whitespace-pre-wrap">
                            {selectedCollaboration.brief}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <Link
                        href={`/dashboard/messages?userId=${selectedCollaboration.influencer_id}&name=${encodeURIComponent(selectedCollaboration.influencer_name)}`}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50 transition-all flex items-center justify-center space-x-2 font-jakarta"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>Mesaj Gönder</span>
                      </Link>
                      <button
                        onClick={() => {
                          // TODO: Edit modal açılacak
                          console.log('Edit collaboration:', selectedCollaboration.id);
                        }}
                        className="py-3 px-6 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all flex items-center justify-center space-x-2 font-jakarta"
                      >
                        <Edit className="w-5 h-5" />
                        <span>Düzenle</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="font-inter">Detayları görmek için bir işbirliği seçin</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
