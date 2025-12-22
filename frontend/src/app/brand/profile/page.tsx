'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
// 👇 Cüzdan Bileşeni Burada Import Edildi
import WalletCard from "@/components/dashboard/WalletCard";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  LogOut,
  Edit3,
  X,
  Mail,
  MapPin,
  Globe,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  Menu,
  Phone,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
const mockCompany = {
  company_name: "TechBrand A.Ş.",
  email: "info@techbrand.com",
  industry: "Teknoloji",
  website: "https://techbrand.com",
  location: "İstanbul, Türkiye",
  phone: "+90 212 555 0123",
  description: "Türkiye'nin önde gelen teknoloji şirketlerinden biri. Yenilikçi ürünler ve influencer marketing stratejileriyle sektörde öncü konumdayız.",
  founded_year: "2018",
  total_campaigns: 48,
  active_campaigns: 12,
  total_spending: 124000,
  avg_roi: 3.8,
  total_collaborations: 156,
  campaign_history: [
    { month: 'Ağustos', campaigns: 8, spending: 18000 },
    { month: 'Eylül', campaigns: 10, spending: 22000 },
    { month: 'Ekim', campaigns: 12, spending: 28000 },
    { month: 'Kasım', campaigns: 12, spending: 32000 },
  ],
  roi_history: [
    { month: 'Ağustos', roi: 3.2 },
    { month: 'Eylül', roi: 3.5 },
    { month: 'Ekim', roi: 3.7 },
    { month: 'Kasım', roi: 3.8 },
  ]
};

export default function BrandProfile() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [company, setCompany] = useState(mockCompany);
  const [editForm, setEditForm] = useState({
    company_name: mockCompany.company_name,
    description: mockCompany.description,
    industry: mockCompany.industry,
    website: mockCompany.website,
    location: mockCompany.location,
    phone: mockCompany.phone
  });

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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompany({
      ...company,
      ...editForm
    });
    setShowEditModal(false);
  };

  const stats = [
    { label: 'Toplam Kampanya', value: company.total_campaigns, icon: Target, color: 'blue' },
    { label: 'Aktif Kampanya', value: company.active_campaigns, icon: Briefcase, color: 'purple' },
    { label: 'Toplam Harcama', value: `₺${(company.total_spending / 1000).toFixed(0)}K`, icon: DollarSign, color: 'orange' },
    { label: 'Ortalama ROI', value: `${company.avg_roi}x`, icon: TrendingUp, color: 'green' },
  ];

  return (
    <div className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-[#F8F9FD] dark:bg-slate-900`}>
      {/* Navbar - Same as brand/home */}
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

            <div className="hidden md:flex items-center space-x-6 font-inter">
              <Link href="/brand/discover" className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors">
                Influencer Keşfet
              </Link>
              <Link href="/brand/campaigns" className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors">
                Kampanyalarım
              </Link>
              <Link href="/brand/analytics" className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors">
                Raporlar
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

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

        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-slate-700"
          >
            <div className="px-4 py-3 space-y-2">
              <Link href="/brand/discover" onClick={() => setShowMobileMenu(false)} className="flex px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium font-inter">
                Influencer Keşfet
              </Link>
              <Link href="/brand/campaigns" onClick={() => setShowMobileMenu(false)} className="flex px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium font-inter">
                Kampanyalarım
              </Link>
              <Link href="/brand/analytics" onClick={() => setShowMobileMenu(false)} className="flex px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium font-inter">
                Raporlar
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-slate-700/50 shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-2xl flex items-center justify-center shadow-xl text-4xl font-bold text-white">
                {company.company_name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#1A2A6C] dark:text-white mb-2 font-jakarta">
                  {company.company_name}
                </h1>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 font-inter">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {company.industry}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {company.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Kuruluş: {company.founded_year}
                  </span>
                </div>
                <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-2xl font-inter">
                  {company.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold font-inter"
            >
              <Edit3 className="w-4 h-4" />
              Düzenle
            </button>
          </div>
        </motion.div>

        {/* 💳 CÜZDAN KARTI BURAYA EKLENDİ 💳 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <WalletCard />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-lg"
            >
              <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A2A6C] dark:text-white mb-1 font-jakarta">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-slate-700/50 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-[#1A2A6C] dark:text-white mb-6 font-jakarta flex items-center gap-2">
              <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              İletişim Bilgileri
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-500/30">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">E-posta</p>
                  <p className="font-semibold text-gray-900 dark:text-white font-inter">{company.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-500/30">
                <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">Telefon</p>
                  <p className="font-semibold text-gray-900 dark:text-white font-inter">{company.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-500/30">
                <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">Web Sitesi</p>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-600 dark:text-orange-400 hover:underline font-inter">
                    {company.website}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Campaign History Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-slate-700/50 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-[#1A2A6C] dark:text-white mb-6 font-jakarta flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Kampanya Geçmişi
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={company.campaign_history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="campaigns" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* ROI History Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-slate-700/50 shadow-lg lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-[#1A2A6C] dark:text-white mb-6 font-jakarta flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              ROI Trendi
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={company.roi_history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Line type="monotone" dataKey="roi" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90%] md:max-w-2xl md:max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-[101] overflow-hidden"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white font-jakarta">Şirket Bilgilerini Düzenle</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto max-h-[calc(85vh-5rem)]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                      Şirket Adı
                    </label>
                    <input
                      type="text"
                      value={editForm.company_name}
                      onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-inter"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                      Açıklama
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-inter resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                        Sektör
                      </label>
                      <input
                        type="text"
                        value={editForm.industry}
                        onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-inter"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                        Konum
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-inter"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                      Web Sitesi
                    </label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-inter"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-inter"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold font-inter"
                  >
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-all font-semibold font-inter"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}