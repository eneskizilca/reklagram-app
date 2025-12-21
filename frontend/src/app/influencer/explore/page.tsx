'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { tr } from 'date-fns/locale';
import { 
  Search, 
  Filter,
  FileText, 
  LogOut,
  Sparkles,
  MapPin,
  TrendingUp,
  Calendar,
  DollarSign,
  Tag,
  Heart,
  ExternalLink,
  Menu,
  X as CloseIcon,
  Instagram,
  Youtube,
  Music2,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';

registerLocale('tr', tr);

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

// Mock campaign data
const mockCampaigns = [
  {
    id: 1,
    brand: 'TechStyle Co.',
    title: 'Yeni Teknoloji Ürün Lansmanı',
    description: 'En yeni akıllı saat serimizi tanıtmak için influencer\'lar arıyoruz. Instagram Reels ve Story içerikleri bekliyoruz.',
    category: 'Teknoloji',
    budget: '₺5,000 - ₺8,000',
    platform: ['Instagram', 'Youtube'],
    location: 'İstanbul',
    deadline: '15 Ocak 2025',
    requirements: ['10K+ takipçi', 'Teknoloji içeriği', 'Story + Reels'],
    engagement: '%3+',
    logo: '🎯',
    isNew: true,
    savedByUser: false
  },
  {
    id: 2,
    brand: 'FashionHub',
    title: 'İlkbahar Koleksiyonu Tanıtımı',
    description: 'Yeni sezon kıyafet koleksiyonumuz için moda influencer\'larıyla çalışmak istiyoruz. Reels ve feed gönderi içerikleri.',
    category: 'Moda',
    budget: '₺3,000 - ₺6,000',
    platform: ['Instagram', 'TikTok'],
    location: 'Ankara',
    deadline: '20 Ocak 2025',
    requirements: ['15K+ takipçi', 'Moda içeriği', '2 Reels + 1 Post'],
    engagement: '%4+',
    logo: '👗',
    isNew: true,
    savedByUser: true
  },
  {
    id: 3,
    brand: 'HealthyLife',
    title: 'Spor Ekipmanları Tanıtımı',
    description: 'Fitness ve sağlıklı yaşam alanında içerik üreten influencer\'lar arıyoruz. Youtube videoları ve Instagram içerikleri.',
    category: 'Sağlık & Spor',
    budget: '₺4,000 - ₺7,000',
    platform: ['Instagram', 'Youtube'],
    location: 'İzmir',
    deadline: '25 Ocak 2025',
    requirements: ['20K+ takipçi', 'Fitness içeriği', 'Video + Story'],
    engagement: '%5+',
    logo: '💪',
    isNew: false,
    savedByUser: false
  },
  {
    id: 4,
    brand: 'FoodieWorld',
    title: 'Yeni Restoran Açılışı',
    description: 'Şehrin merkezindeki yeni restoranımızın tanıtımı için yemek bloggerları ve influencer\'lar arıyoruz.',
    category: 'Yiyecek & İçecek',
    budget: '₺2,500 - ₺5,000',
    platform: ['Instagram', 'TikTok'],
    location: 'İstanbul',
    deadline: '10 Ocak 2025',
    requirements: ['8K+ takipçi', 'Food content', 'Story + Post'],
    engagement: '%3.5+',
    logo: '🍕',
    isNew: true,
    savedByUser: false
  },
  {
    id: 5,
    brand: 'TravelTurkey',
    title: 'Kapadokya Turizm Tanıtımı',
    description: 'Kapadokya bölgesinin tanıtımı için seyahat içeriği üreten influencer\'lar arıyoruz. Youtube vlog ve Instagram içerikleri.',
    category: 'Seyahat',
    budget: '₺6,000 - ₺10,000',
    platform: ['Instagram', 'Youtube'],
    location: 'Kapadokya',
    deadline: '30 Ocak 2025',
    requirements: ['25K+ takipçi', 'Travel content', 'Video + Reels + Post'],
    engagement: '%4+',
    logo: '✈️',
    isNew: false,
    savedByUser: true
  },
  {
    id: 6,
    brand: 'BeautyGlow',
    title: 'Cilt Bakım Ürünleri',
    description: 'Yeni cilt bakım serimiz için güzellik ve kozmetik alanında içerik üreten influencer\'lar arıyoruz.',
    category: 'Güzellik',
    budget: '₺3,500 - ₺6,500',
    platform: ['Instagram', 'TikTok', 'Youtube'],
    location: 'İstanbul',
    deadline: '18 Ocak 2025',
    requirements: ['12K+ takipçi', 'Beauty content', 'Reels + Story + Review'],
    engagement: '%4.5+',
    logo: '💄',
    isNew: true,
    savedByUser: false
  }
];

const categories = ['Tümü', 'Favoriler', 'Teknoloji', 'Moda', 'Sağlık & Spor', 'Yiyecek & İçecek', 'Seyahat', 'Güzellik'];

export default function InfluencerExplore() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedCampaigns, setSavedCampaigns] = useState<number[]>([2, 5]); // Mock saved campaigns
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<typeof mockCampaigns[0] | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    message: '',
    contentIdea: '',
    availableDate: null as Date | null,
    expectedDelivery: null as Date | null
  });

  useEffect(() => {
    // Auth kontrolü
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    const email = localStorage.getItem('user_email');

    if (!token || role !== 'influencer') {
      router.push('/login');
      return;
    }

    // Email'den isim çıkar (mock olarak)
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

  const toggleSaveCampaign = (campaignId: number) => {
    setSavedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const openApplicationModal = (campaign: typeof mockCampaigns[0]) => {
    setSelectedCampaign(campaign);
    setShowApplicationModal(true);
  };

  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedCampaign(null);
    setApplicationForm({
      message: '',
      contentIdea: '',
      availableDate: null,
      expectedDelivery: null
    });
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Backend API call
    console.log('Application submitted:', {
      campaign: selectedCampaign?.id,
      ...applicationForm
    });
    closeApplicationModal();
    setShowSuccessModal(true);
    
    // 3 saniye sonra success modal'ı kapat
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'Instagram': return <Instagram className="w-4 h-4" />;
      case 'Youtube': return <Youtube className="w-4 h-4" />;
      case 'TikTok': return <Music2 className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  // Filter campaigns
  const filteredCampaigns = mockCampaigns.filter(campaign => {
    // Favoriler filtresi
    if (selectedCategory === 'Favoriler') {
      const isSaved = savedCampaigns.includes(campaign.id);
      const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           campaign.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      return isSaved && matchesSearch;
    }
    
    // Diğer kategoriler
    const matchesCategory = selectedCategory === 'Tümü' || campaign.category === selectedCategory;
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
                className="text-[#1A2A6C] dark:text-white hover:text-[#7C3AED] dark:hover:text-[#A78BFA] font-semibold transition-colors border-b-2 border-[#1A2A6C] dark:border-white pb-1"
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
                className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
              >
                {showMobileMenu ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Profile Menu */}
              <div className="relative profile-menu-container">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white hover:shadow-lg transition-all"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    {userName.charAt(0)}
                  </div>
                  <span className="font-semibold font-jakarta hidden sm:inline">{userName}</span>
                </button>

                {/* Dropdown */}
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
                className="flex px-4 py-3 text-[#1A2A6C] dark:text-white bg-gray-100 dark:bg-slate-700 rounded-lg font-semibold font-inter"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A2A6C] dark:text-white font-jakarta">
              Kampanya İlanları
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-inter">
            Sana uygun kampanyaları keşfet ve başvur
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
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
              placeholder="Kampanya ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all font-semibold text-gray-700 dark:text-gray-300 font-inter"
          >
            <Filter className="w-5 h-5" />
            <span>Filtreler</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </motion.div>

        {/* Filter Categories */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 font-jakarta">Kategori</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full font-medium font-inter transition-all flex items-center space-x-2 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {category === 'Favoriler' && (
                        <Heart className={`w-4 h-4 ${selectedCategory === category ? 'fill-white' : 'fill-red-500'}`} />
                      )}
                      <span>{category}</span>
                      {category === 'Favoriler' && savedCampaigns.length > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          selectedCategory === category
                            ? 'bg-white/20 text-white'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          {savedCampaigns.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 font-inter"
        >
          <span className="font-semibold">{filteredCampaigns.length} kampanya bulundu</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{filteredCampaigns.filter(c => c.isNew).length} yeni</span>
        </motion.div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                    {campaign.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                      {campaign.brand}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold font-inter">
                        {campaign.category}
                      </span>
                      {campaign.isNew && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold font-inter">
                          Yeni
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={() => toggleSaveCampaign(campaign.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      savedCampaigns.includes(campaign.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* Title */}
              <h4 className="text-xl font-bold text-[#1A2A6C] dark:text-white mb-3 font-jakarta">
                {campaign.title}
              </h4>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 font-inter line-clamp-2">
                {campaign.description}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-inter">{campaign.budget}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-inter">{campaign.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-inter">{campaign.deadline}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-inter">{campaign.engagement} etkileşim</span>
                </div>
              </div>

              {/* Platforms */}
              <div className="flex items-center space-x-2 mb-4">
                {campaign.platform.map((platform) => (
                  <div
                    key={platform}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 dark:bg-slate-700 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 font-inter"
                  >
                    {getPlatformIcon(platform)}
                    <span>{platform}</span>
                  </div>
                ))}
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 font-jakarta">
                  Gereksinimler
                </h5>
                <div className="flex flex-wrap gap-2">
                  {campaign.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-inter"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => openApplicationModal(campaign)}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50 transition-all flex items-center justify-center space-x-2 font-jakarta"
              >
                <span>İşbirliği Başvurusu Yap</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
              Kampanya Bulunamadı
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-inter">
              Arama kriterlerinize uygun kampanya bulunmamaktadır
            </p>
          </motion.div>
        )}
      </main>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplicationModal && selectedCampaign && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeApplicationModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-3xl w-full max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white p-6 rounded-t-3xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                        {selectedCampaign.logo}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold font-jakarta">{selectedCampaign.brand}</h2>
                        <p className="text-white/80 font-inter">{selectedCampaign.title}</p>
                      </div>
                    </div>
                    <button
                      onClick={closeApplicationModal}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <CloseIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Campaign Summary */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">
                    Kampanya Özeti
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-gray-700 dark:text-gray-300 font-inter">{selectedCampaign.budget}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-gray-700 dark:text-gray-300 font-inter">{selectedCampaign.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-700 dark:text-gray-300 font-inter">{selectedCampaign.deadline}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-700 dark:text-gray-300 font-inter">{selectedCampaign.engagement} etkileşim</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                      Gereksinimler:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCampaign.requirements.map((req, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold font-inter"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Application Form */}
                <form onSubmit={handleApplicationSubmit} className="p-6">
                  <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">
                    Başvuru Formu
                  </h3>

                  {/* Message */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                      Neden Bu Kampanya İçin Uygunsunuz?
                    </label>
                    <textarea
                      required
                      value={applicationForm.message}
                      onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter resize-none"
                      placeholder="Kendini ve içerik tarzını tanıt, neden bu kampanya için uygun olduğunu açıkla..."
                    />
                  </div>

                  {/* Content Idea */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                      İçerik Fikrin Nedir?
                    </label>
                    <textarea
                      required
                      value={applicationForm.contentIdea}
                      onChange={(e) => setApplicationForm({ ...applicationForm, contentIdea: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter resize-none"
                      placeholder="Bu kampanya için üretmeyi planladığın içeriği detaylı bir şekilde anlat..."
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                        Başlangıç Tarihi
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <DatePicker
                          selected={applicationForm.availableDate}
                          onChange={(date) => setApplicationForm({ ...applicationForm, availableDate: date })}
                          minDate={new Date()}
                          dateFormat="dd MMMM yyyy"
                          placeholderText="Tarih seçin..."
                          required
                          locale="tr"
                          showMonthYearPicker={false}
                          showYearDropdown
                          dateFormatCalendar="MMMM"
                          yearDropdownItemNumber={15}
                          dropdownMode="select"
                          popperPlacement="top"
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-inter shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer"
                          wrapperClassName="w-full"
                          calendarClassName="modern-datepicker"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                        Teslimat Tarihi
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <DatePicker
                          selected={applicationForm.expectedDelivery}
                          onChange={(date) => setApplicationForm({ ...applicationForm, expectedDelivery: date })}
                          minDate={applicationForm.availableDate || new Date()}
                          dateFormat="dd MMMM yyyy"
                          placeholderText="Tarih seçin..."
                          required
                          locale="tr"
                          showMonthYearPicker={false}
                          showYearDropdown
                          dateFormatCalendar="MMMM"
                          yearDropdownItemNumber={15}
                          dropdownMode="select"
                          popperPlacement="top"
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-inter shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer"
                          wrapperClassName="w-full"
                          calendarClassName="modern-datepicker"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={closeApplicationModal}
                      className="flex-1 py-3 px-6 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all font-jakarta"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50 transition-all flex items-center justify-center space-x-2 font-jakarta"
                    >
                      <span>Başvuru Gönder</span>
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-8 right-8 z-[9999] max-w-md"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6 backdrop-blur-xl">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </motion.div>
                  </motion.div>
                </div>
                <div className="flex-1">
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-bold text-gray-900 dark:text-white mb-1 font-jakarta"
                  >
                    Başvuru Gönderildi! 🎉
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-gray-600 dark:text-gray-300 font-inter"
                  >
                    Marka en kısa sürede size dönüş yapacaktır.
                  </motion.p>
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-4 origin-left"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
