'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FileText, 
  LogOut,
  Download,
  Share2,
  Instagram,
  Youtube,
  Music2,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Mail,
  MapPin,
  Tag,
  LinkIcon,
  AlertCircle,
  CheckCircle2,
  Edit3,
  X,
  ChevronDown,
  Check,
  Menu
} from 'lucide-react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

// Mock Data
const mockProfile = {
  username: "sena.ates",
  display_name: "Sena Ateş",
  email: "sena@example.com",
  bio: "Sanat ve yaratıcılık üzerine içerik üreticisi. Instagram ve YouTube'da 215K+ takipçi.",
  category: "Sanat & Yaratıcılık",
  location: "İstanbul, Türkiye",
  profilePhoto: "/reklagram-logo.png",
  followers: 215400,
  engagement_rate: 8.5,
  avg_views: 45000,
  total_posts: 342,
  connected_accounts: {
    instagram: { connected: true, username: "@sanatsena", followers: 215400 },
    youtube: { connected: true, username: "Sena Sanat", followers: 89000 },
    tiktok: { connected: false, username: "", followers: 0 }
  },
  growth_history: [
    { month: 'Ağustos', followers: 198000 },
    { month: 'Eylül', followers: 205000 },
    { month: 'Ekim', followers: 210000 },
    { month: 'Kasım', followers: 215400 },
  ],
  demographics: [
    { age: '18-24', percentage: 45 },
    { age: '25-34', percentage: 35 },
    { age: '35-44', percentage: 15 },
    { age: '45+', percentage: 5 },
  ],
  gender_demographics: [
    { gender: 'Kadın', percentage: 65 },
    { gender: 'Erkek', percentage: 35 },
  ]
};

export default function InfluencerProfile() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [editForm, setEditForm] = useState({
    display_name: mockProfile.display_name,
    bio: mockProfile.bio,
    category: mockProfile.category,
    location: mockProfile.location,
    instagram_username: mockProfile.connected_accounts.instagram.username,
    youtube_username: mockProfile.connected_accounts.youtube.username,
    tiktok_username: ''
  });

  const categories = [
    { value: 'Sanat & Yaratıcılık', icon: '🎨' },
    { value: 'Teknoloji', icon: '💻' },
    { value: 'Moda', icon: '👗' },
    { value: 'Spor', icon: '⚽' },
    { value: 'Yemek', icon: '🍳' },
    { value: 'Seyahat', icon: '✈️' },
    { value: 'Güzellik', icon: '💄' },
    { value: 'Eğitim', icon: '📚' },
    { value: 'Oyun', icon: '🎮' },
    { value: 'Müzik', icon: '🎵' }
  ];

  useEffect(() => {
    // Auth kontrolü
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    const email = localStorage.getItem('user_email');

    if (!token || role !== 'influencer') {
      router.push('/login');
      return;
    }

    if (email) {
      const name = email.split('@')[0];
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    }
  }, [router]);

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showProfileMenu && !target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    router.push('/login');
  };

  const handleConnectAccount = (platform: string) => {
    alert(`${platform} hesabı bağlama özelliği yakında!`);
  };

  const handleDownloadMediaKit = () => {
    alert('Media Kit indirme özelliği yakında!');
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    // Profili güncelle
    setProfile({
      ...profile,
      display_name: editForm.display_name,
      bio: editForm.bio,
      category: editForm.category,
      location: editForm.location,
      connected_accounts: {
        ...profile.connected_accounts,
        instagram: {
          ...profile.connected_accounts.instagram,
          username: editForm.instagram_username
        },
        youtube: {
          ...profile.connected_accounts.youtube,
          username: editForm.youtube_username
        },
        tiktok: {
          connected: editForm.tiktok_username !== '',
          username: editForm.tiktok_username,
          followers: 0
        }
      }
    });
    setShowEditModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCategorySelect = (category: string) => {
    setEditForm({
      ...editForm,
      category: category
    });
    setShowCategoryDropdown(false);
  };

  // Dropdown dışına tıklayınca kapat (kategori dropdown)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCategoryDropdown && !target.closest('.category-dropdown-container')) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showCategoryDropdown]);

  return (
    <div className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-[#F8F9FD] dark:bg-slate-900`}>
      {/* Navbar - Home ile aynı */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/influencer/home" className="flex items-center space-x-3">
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
                href="/influencer/explore"
                className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors"
              >
                Keşfet / İlanlar
              </Link>
              <Link 
                href="/influencer/collaborations"
                className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors"
              >
                İşbirliklerim
              </Link>
            </div>

            {/* Mobile Menu & Profile */}
            <div className="flex items-center space-x-2">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="relative profile-menu-container">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {userName.charAt(0)}
                </div>
                <span className="font-semibold font-jakarta">{userName}</span>
              </button>

              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                >
                  <Link
                    href="/influencer/profile"
                    className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-inter text-gray-700 dark:text-gray-300"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Profilim</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors font-inter cursor-pointer"
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

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-slate-700"
          >
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/influencer/explore"
                onClick={() => setShowMobileMenu(false)}
                className="flex px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium font-inter"
              >
                Keşfet / İlanlar
              </Link>
              <Link
                href="/influencer/collaborations"
                onClick={() => setShowMobileMenu(false)}
                className="flex px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium font-inter"
              >
                İşbirliklerim
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold text-[#1A2A6C] dark:text-white mb-2 font-jakarta text-center">
            Profilim & Media Kit
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-inter text-center">
            İstatistiklerini yönet ve Media Kit'ini oluştur
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol: Profil Kartı */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-lg sticky top-24">
              {/* Profile Photo with Edit Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-linear-to-br from-[#1A2A6C] via-[#7C3AED] to-[#F97316] p-1">
                    <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                      <div className="text-5xl font-bold text-[#1A2A6C] dark:text-white">
                        {profile.display_name.charAt(0)}
                      </div>
                    </div>
                  </div>
                  {/* Edit Icon Button */}
                  <button
                    onClick={handleEditProfile}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all cursor-pointer shadow-md"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Name & Username */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#1A2A6C] dark:text-white mb-1 font-jakarta">
                  {profile.display_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 font-inter">
                  @{profile.username}
                </p>
              </div>

              {/* Bio */}
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 font-inter text-center">
                {profile.bio}
              </p>

              {/* Info Tags */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-inter">{profile.category}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-inter">{profile.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-inter">{profile.email}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-jakarta">
                    {(profile.followers / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 font-inter">Takipçi</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-jakarta">
                    %{profile.engagement_rate}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 font-inter">Etkileşim</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sağ: Analiz ve Media Kit */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Kit Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-3xl p-8 text-white shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 font-jakarta">Media Kit</h3>
                  <p className="text-blue-100 font-inter">Profesyonel portfolyonuzu oluşturun</p>
                </div>
                <FileText className="w-12 h-12 opacity-50" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleDownloadMediaKit}
                  className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-3 px-4 font-semibold transition-all font-inter"
                >
                  <Download className="w-5 h-5" />
                  <span>İndir (PDF)</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-3 px-4 font-semibold transition-all font-inter">
                  <Share2 className="w-5 h-5" />
                  <span>Paylaş</span>
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-blue-100 font-inter">
                  ✨ Media Kit'iniz son 7 gün önce güncellendi. Güncel tutmak için hesaplarınızı yeniden bağlayın.
                </p>
              </div>
            </motion.div>

            {/* Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                  Takipçi Büyümesi
                </h3>
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={profile.growth_history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="followers" 
                    stroke="#7C3AED" 
                    strokeWidth={3}
                    dot={{ fill: '#7C3AED', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Demographics */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-lg"
              >
                <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">
                  Yaş Dağılımı
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={profile.demographics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="age" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="percentage" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Gender Demographics */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-lg"
              >
                <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">
                  Cinsiyet Dağılımı
                </h3>
                <div className="space-y-4">
                  {profile.gender_demographics.map((item) => (
                    <div key={item.gender}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-inter">
                          {item.gender}
                        </span>
                        <span className="text-sm font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                          %{item.percentage}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            item.gender === 'Kadın' 
                              ? 'bg-pink-500' 
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Connected Accounts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-lg"
            >
              <h3 className="text-xl font-bold text-[#1A2A6C] dark:text-white mb-6 font-jakarta">
                Bağlı Hesaplar
              </h3>

              <div className="space-y-4">
                {/* Instagram */}
                <div className="flex items-center justify-between p-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white font-jakarta">
                        {profile.connected_accounts.instagram.connected ? profile.connected_accounts.instagram.username : 'Instagram'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-inter">
                        {profile.connected_accounts.instagram.connected 
                          ? `${(profile.connected_accounts.instagram.followers / 1000).toFixed(1)}K takipçi` 
                          : 'Bağlı değil'}
                      </div>
                    </div>
                  </div>
                  {profile.connected_accounts.instagram.connected ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <button
                      onClick={() => handleConnectAccount('Instagram')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm font-inter"
                    >
                      Bağla
                    </button>
                  )}
                </div>

                {/* YouTube */}
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                      <Youtube className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white font-jakarta">
                        {profile.connected_accounts.youtube.connected ? profile.connected_accounts.youtube.username : 'YouTube'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-inter">
                        {profile.connected_accounts.youtube.connected 
                          ? `${(profile.connected_accounts.youtube.followers / 1000).toFixed(1)}K abone` 
                          : 'Bağlı değil'}
                      </div>
                    </div>
                  </div>
                  {profile.connected_accounts.youtube.connected ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <button
                      onClick={() => handleConnectAccount('YouTube')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm font-inter"
                    >
                      Bağla
                    </button>
                  )}
                </div>

                {/* TikTok */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-900 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                      <Music2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white font-jakarta">
                        {profile.connected_accounts.tiktok.connected ? profile.connected_accounts.tiktok.username : 'TikTok'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-inter">
                        {profile.connected_accounts.tiktok.connected 
                          ? `${(profile.connected_accounts.tiktok.followers / 1000).toFixed(1)}K takipçi` 
                          : 'Bağlı değil'}
                      </div>
                    </div>
                  </div>
                  {profile.connected_accounts.tiktok.connected ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <button
                      onClick={() => handleConnectAccount('TikTok')}
                      className="px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors font-semibold text-sm font-inter"
                    >
                      Bağla
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                Profili Düzenle
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Personal Info Section */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">
                  Kişisel Bilgiler
                </h3>
                <div className="space-y-4">
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                      Görünen Ad
                    </label>
                    <input
                      type="text"
                      name="display_name"
                      value={editForm.display_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-inter"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                      Biyografi
                    </label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-inter"
                      placeholder="Kendinizi tanıtın..."
                    />
                  </div>

                  {/* Category - Custom Dropdown */}
                  <div className="category-dropdown-container relative">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                      Kategori
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-inter cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      <span className="flex items-center space-x-2">
                        <span>{categories.find(c => c.value === editForm.category)?.icon}</span>
                        <span>{editForm.category}</span>
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl shadow-xl max-h-64 overflow-y-auto scrollbar-thin"
                      >
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => handleCategorySelect(cat.value)}
                            className={`w-full px-4 py-3 flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors font-inter cursor-pointer ${
                              editForm.category === cat.value 
                                ? 'bg-indigo-50 dark:bg-slate-600' 
                                : ''
                            }`}
                          >
                            <span className="flex items-center space-x-3">
                              <span className="text-xl">{cat.icon}</span>
                              <span className="text-gray-900 dark:text-white">{cat.value}</span>
                            </span>
                            {editForm.category === cat.value && (
                              <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                      Konum
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-inter"
                      placeholder="Şehir, Ülke"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Accounts Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">
                  Sosyal Medya Hesapları
                </h3>
                <div className="space-y-4">
                  {/* Instagram */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                      <Instagram className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Instagram Kullanıcı Adı</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 dark:text-gray-400 font-inter">@</span>
                      <input
                        type="text"
                        name="instagram_username"
                        value={editForm.instagram_username.replace('@', '')}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-inter"
                        placeholder="kullaniciadi"
                      />
                    </div>
                  </div>

                  {/* YouTube */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                      <Youtube className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>YouTube Kullanıcı Adı</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 dark:text-gray-400 font-inter">@</span>
                      <input
                        type="text"
                        name="youtube_username"
                        value={editForm.youtube_username.replace('@', '')}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-inter"
                        placeholder="kullaniciadi"
                      />
                    </div>
                  </div>

                  {/* TikTok */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                      <Music2 className="w-4 h-4 text-gray-900 dark:text-gray-400" />
                      <span>TikTok Kullanıcı Adı</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 dark:text-gray-400 font-inter">@</span>
                      <input
                        type="text"
                        name="tiktok_username"
                        value={editForm.tiktok_username.replace('@', '')}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-inter"
                        placeholder="kullaniciadi"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-6 flex items-center justify-end space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold transition-all font-inter cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-3 bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white rounded-xl hover:shadow-lg font-semibold transition-all font-inter cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

