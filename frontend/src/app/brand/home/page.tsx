"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Search,
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Briefcase,
  LogOut,
  Menu,
  X as CloseIcon,
  Plus,
  MessageSquare,
  Bell,
  Calendar,
  CheckCircle2,
  XCircle,
  BarChart3,
  Heart,
  MapPin,
  Eye,
  AlertCircle,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';

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

export default function BrandHomePage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Auth kontrolü
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    const email = localStorage.getItem('user_email');

    if (!token || role !== 'brand') {
      router.push('/login');
      return;
    }

    // Email'den şirket ismi çıkar (mock olarak)
    if (email) {
      const name = email.split('@')[0];
      setCompanyName(name.charAt(0).toUpperCase() + name.slice(1));
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

  const quickActions = [
    {
      id: 1,
      title: 'Influencer Keşfet',
      description: '250+ doğrulanmış influencer seni bekliyor',
      icon: Sparkles,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-500/30',
      link: '/brand/explore',
      badge: '250+ Profil',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
    },
    {
      id: 2,
      title: 'Aktif Kampanyalar',
      description: '12 kampanyan aktif olarak devam ediyor',
      icon: Target,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-500/30',
      link: '/brand/campaigns',
      badge: '12 Aktif',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
    },
    {
      id: 3,
      title: 'Bekleyen Yanıtlar',
      description: '8 influencer tekliflerinize cevap bekliyor',
      icon: MessageSquare,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-orange-200 dark:border-orange-500/30',
      link: '/brand/proposals',
      badge: '8 Bekleyen',
      badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      icon: CheckCircle2,
      text: 'Ayşe Yılmaz teklifinizi kabul etti - Yaz Kampanyası 2025',
      type: 'success',
      time: '2 saat önce'
    },
    {
      id: 2,
      icon: MessageSquare,
      text: 'Mehmet Demir size mesaj gönderdi',
      type: 'info',
      time: '5 saat önce'
    },
    {
      id: 3,
      icon: AlertCircle,
      text: 'Black Friday Özel kampanyanızın bütçesi %80 tamamlandı',
      type: 'warning',
      time: '1 gün önce'
    },
    {
      id: 4,
      icon: XCircle,
      text: 'Can Özdemir teklifinizi reddetti',
      type: 'error',
      time: '2 gün önce'
    }
  ];

  // Mock stats data
  const statsCards = [
    { label: 'Aktif Kampanya', value: '12', icon: Briefcase, trend: '+3', color: 'blue' },
    { label: 'Toplam İşbirliği', value: '48', icon: Users, trend: '+8', color: 'purple' },
    { label: 'Toplam Harcama', value: '₺124K', icon: DollarSign, trend: '+12%', color: 'orange' },
    { label: 'Ortalama ROI', value: '3.8x', icon: TrendingUp, trend: '+0.5x', color: 'green' },
  ];

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
                href="/brand/analytics"
                className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors"
              >
                Raporlar
              </Link>
            </div>

            {/* Mobile Menu & Profile */}
            <div className="flex items-center space-x-2">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                {showMobileMenu ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Profile Menu */}
              <div className="relative profile-menu-container">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    {companyName.charAt(0)}
                  </div>
                  <span className="font-semibold font-jakarta">{companyName}</span>
                </button>

                {/* Dropdown */}
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
                      <span>Şirket Bilgileri</span>
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
                href="/brand/explore"
                onClick={() => setShowMobileMenu(false)}
                className="flex px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium font-inter"
              >
                Influencer Keşfet
              </Link>
              <Link
                href="/brand/analytics"
                onClick={() => setShowMobileMenu(false)}
                className="flex px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium font-inter"
              >
                Raporlar
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">
            Hoşgeldin <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F97316] dark:from-[#818CF8] dark:via-[#A78BFA] dark:to-[#FB923C] bg-clip-text text-transparent">{companyName}</span>!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-inter">
            Kampanyalarını yönet ve doğru influencer'ları bul
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-500 dark:text-green-400">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1A2A6C] dark:text-white mb-1 font-jakarta">
                {stat.value}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            >
              <Link href={action.link}>
                <div className={`${action.bgColor} backdrop-blur-md rounded-3xl p-6 border ${action.borderColor} hover:shadow-2xl transition-all cursor-pointer h-full`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${action.badgeColor} font-inter`}>
                      {action.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#1A2A6C] dark:text-white mb-2 font-jakarta">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 font-inter">
                    {action.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center space-x-2 text-[#1A2A6C] dark:text-white font-semibold font-inter">
                    <span>Görüntüle</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activities Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-[#1A2A6C] dark:text-white font-jakarta">
              Son Aktiviteler
            </h2>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className={`flex items-start space-x-3 p-4 rounded-xl ${
                  activity.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30' 
                    : activity.type === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-500/30'
                    : activity.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30'
                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30'
                }`}
              >
                <activity.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  activity.type === 'success' 
                    ? 'text-green-600 dark:text-green-400'
                    : activity.type === 'warning'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : activity.type === 'error'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium font-inter">
                    {activity.text}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-inter">
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
