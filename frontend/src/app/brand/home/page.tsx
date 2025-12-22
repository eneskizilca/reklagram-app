'use client';

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
  MessageSquare,
  Bell,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  User // 👈 EKLENDİ: Profil ikonu için
} from 'lucide-react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';

// 👇 CÜZDAN BİLEŞENİ
import WalletCard from "@/components/dashboard/WalletCard";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showProfileMenu && !target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const quickActions = [
    {
      id: 1,
      title: 'Influencer Keşfet',
      description: '250+ doğrulanmış influencer',
      icon: Sparkles,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200',
      link: '/brand/explore',
      badge: 'Popüler',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 2,
      title: 'Aktif Kampanyalar',
      description: '12 kampanya yayında',
      icon: Target,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200',
      link: '/brand/campaigns',
      badge: '12 Aktif',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 3,
      title: 'İşbirliklerim',
      description: '5 aktif işbirliği',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200',
      link: '/brand/collaborations',
      badge: '5 Süren',
      badgeColor: 'bg-emerald-100 text-emerald-700'
    }
  ];

  const recentActivities = [
    { id: 1, icon: CheckCircle2, text: 'Ayşe Yılmaz teklifinizi kabul etti', type: 'success', time: '2 saat önce' },
    { id: 3, icon: AlertCircle, text: 'Black Friday bütçesi %80 doldu', type: 'warning', time: '1 gün önce' },
    { id: 4, icon: XCircle, text: 'Can Özdemir teklifi reddetti', type: 'error', time: '2 gün önce' }
  ];

  const statsCards = [
    { label: 'Aktif Kampanya', value: '12', icon: Briefcase, trend: '+3', color: 'blue' },
    { label: 'Toplam İşbirliği', value: '48', icon: Users, trend: '+8', color: 'purple' },
    { label: 'Toplam Harcama', value: '₺124K', icon: DollarSign, trend: '+12%', color: 'orange' },
    { label: 'ROI Oranı', value: '3.8x', icon: TrendingUp, trend: '+0.5x', color: 'green' },
  ];

  return (
    <div className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-[#F8F9FD] dark:bg-slate-900`}>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/brand/home" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image src="/reklagram-logo.png" alt="ReklaGram" width={40} height={40} className="object-contain" />
              </div>
              <span className="text-xl font-bold text-[#1A2A6C] dark:text-white font-jakarta">ReklaGram</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6 font-inter">
              <Link href="/brand/explore" className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] font-medium">Keşfet</Link>
              <Link href="/brand/campaigns" className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] font-medium">Kampanyalarım</Link>
              <Link href="/brand/collaborations" className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] font-medium">İşbirliklerim</Link>
              <Link href="/brand/analytics" className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] font-medium">Raporlar</Link>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 rounded-lg">
                {showMobileMenu ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="relative profile-menu-container">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white hover:shadow-lg transition-all">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    {companyName.charAt(0)}
                  </div>
                  <span className="font-semibold font-jakarta hidden md:block">{companyName}</span>
                </button>
                
                {/* 🛠️ DROPDOWN MENÜ: DÜZELTİLDİ */}
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    {/* ✅ Profilim Linki Eklendi */}
                    <Link href="/brand/profile" className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 text-gray-700 border-b border-gray-100 transition-colors">
                      <User className="w-4 h-4" /> 
                      <span className="font-medium">Profilim</span>
                    </Link>

                    {/* Çıkış Yap Butonu */}
                    <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors">
                      <LogOut className="w-4 h-4" /> 
                      <span className="font-medium">Çıkış Yap</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link href="/brand/explore" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Keşfet</Link>
              <Link href="/brand/campaigns" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Kampanyalar</Link>
              <Link href="/brand/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Profilim</Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#1A2A6C] dark:text-white mb-2 font-jakarta">
            Hoşgeldin <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F97316] bg-clip-text text-transparent">{companyName}</span>!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-inter">Kampanyalarını yönet ve büyümeye başla.</p>
        </motion.div>

        {/* 🛠️ HYBRID LAYOUT: CÜZDAN + İSTATİSTİKLER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* SOL: CÜZDAN KARTI */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 h-full"
          >
            <WalletCard userType="brand" />
          </motion.div>

          {/* SAĞ: İSTATİSTİK KARTLARI */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 h-full">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#1A2A6C] dark:text-white font-jakarta">{stat.value}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={action.link}>
                <div className={`${action.bgColor} backdrop-blur-md rounded-3xl p-6 border ${action.borderColor} hover:shadow-2xl transition-all cursor-pointer h-full relative overflow-hidden group`}>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${action.badgeColor}`}>{action.badge}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1A2A6C] dark:text-white mb-2 font-jakarta">{action.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 font-inter">{action.description}</p>
                    <div className="flex items-center space-x-2 text-[#1A2A6C] font-semibold text-sm group-hover:translate-x-2 transition-transform">
                      <span>Görüntüle</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* RECENT ACTIVITIES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-[#1A2A6C] dark:text-white font-jakarta">Son Aktiviteler</h2>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={activity.id} className={`flex items-start space-x-3 p-4 rounded-xl border ${
                activity.type === 'success' ? 'bg-green-50 border-green-200' :
                activity.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
              }`}>
                <activity.icon className={`w-5 h-5 mt-0.5 ${
                  activity.type === 'success' ? 'text-green-600' :
                  activity.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}