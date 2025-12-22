'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { tr } from 'date-fns/locale';
import { 
  Search, 
  Filter,
  Briefcase, 
  LogOut,
  Users,
  MapPin,
  TrendingUp,
  Target,
  Heart,
  ExternalLink,
  Menu,
  X as CloseIcon,
  Instagram,
  Youtube,
  Music2,
  ChevronDown,
  Sparkles,
  Send,
  CheckCircle2,
  Calendar
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

// Mock influencer data
const mockInfluencers = [
  {
    id: 1,
    name: 'Ayşe Demir',
    username: '@aysedemir',
    avatar: '👩‍💼',
    category: 'Teknoloji',
    bio: 'Teknoloji ve gadget incelemeleri yapıyorum. Apple ekosistemi üzerine uzmanlaştım.',
    location: 'İstanbul',
    platforms: {
      instagram: { followers: '125K', engagement: '4.2%' },
      youtube: { followers: '89K', engagement: '3.8%' },
      tiktok: { followers: '45K', engagement: '5.1%' }
    },
    totalReach: '259K',
    avgEngagement: '4.5%',
    priceRange: '₺8,000 - ₺12,000',
    verified: true,
    collaborations: 23,
    tags: ['Tech Review', 'Apple', 'Gadgets'],
    rating: 4.8
  },
  {
    id: 2,
    name: 'Mehmet Yılmaz',
    username: '@mehmetsporcu',
    avatar: '💪',
    category: 'Sağlık & Spor',
    bio: 'Fitness coach ve beslenme danışmanı. Sağlıklı yaşam için ipuçları paylaşıyorum.',
    location: 'Ankara',
    platforms: {
      instagram: { followers: '180K', engagement: '5.5%' },
      youtube: { followers: '120K', engagement: '4.2%' },
      tiktok: { followers: '95K', engagement: '6.8%' }
    },
    totalReach: '395K',
    avgEngagement: '5.8%',
    priceRange: '₺10,000 - ₺15,000',
    verified: true,
    collaborations: 41,
    tags: ['Fitness', 'Nutrition', 'Lifestyle'],
    rating: 4.9
  },
  {
    id: 3,
    name: 'Zeynep Kaya',
    username: '@zeynepfashion',
    avatar: '👗',
    category: 'Moda',
    bio: 'Moda ve stil danışmanı. Trend analizleri ve kombinler paylaşıyorum.',
    location: 'İzmir',
    platforms: {
      instagram: { followers: '210K', engagement: '6.2%' },
      youtube: { followers: '65K', engagement: '3.5%' },
      tiktok: { followers: '150K', engagement: '7.4%' }
    },
    totalReach: '425K',
    avgEngagement: '6.5%',
    priceRange: '₺12,000 - ₺18,000',
    verified: true,
    collaborations: 38,
    tags: ['Fashion', 'Style', 'Trends'],
    rating: 4.7
  },
  {
    id: 4,
    name: 'Can Özkan',
    username: '@cantravel',
    avatar: '✈️',
    category: 'Seyahat',
    bio: 'Dünya gezgini. Türkiye ve dünya turları ile seyahat ipuçları.',
    location: 'Antalya',
    platforms: {
      instagram: { followers: '95K', engagement: '4.8%' },
      youtube: { followers: '145K', engagement: '5.2%' },
      tiktok: { followers: '70K', engagement: '4.5%' }
    },
    totalReach: '310K',
    avgEngagement: '4.9%',
    priceRange: '₺9,000 - ₺14,000',
    verified: true,
    collaborations: 29,
    tags: ['Travel', 'Tourism', 'Culture'],
    rating: 4.6
  },
  {
    id: 5,
    name: 'Elif Şahin',
    username: '@elifbeauty',
    avatar: '💄',
    category: 'Güzellik',
    bio: 'Makyaj sanatçısı ve güzellik vlogger. Cilt bakımı ve makyaj tüyoları.',
    location: 'İstanbul',
    platforms: {
      instagram: { followers: '165K', engagement: '5.9%' },
      youtube: { followers: '98K', engagement: '4.5%' },
      tiktok: { followers: '185K', engagement: '8.2%' }
    },
    totalReach: '448K',
    avgEngagement: '6.8%',
    priceRange: '₺11,000 - ₺16,000',
    verified: true,
    collaborations: 45,
    tags: ['Beauty', 'Makeup', 'Skincare'],
    rating: 4.9
  },
  {
    id: 6,
    name: 'Burak Yıldırım',
    username: '@burakfoodie',
    avatar: '🍕',
    category: 'Yiyecek & İçecek',
    bio: 'Yemek blogger ve şef. Lezzetli tarifler ve restoran incelemeleri.',
    location: 'Bursa',
    platforms: {
      instagram: { followers: '135K', engagement: '5.2%' },
      youtube: { followers: '110K', engagement: '4.8%' },
      tiktok: { followers: '88K', engagement: '6.1%' }
    },
    totalReach: '333K',
    avgEngagement: '5.5%',
    priceRange: '₺8,500 - ₺13,000',
    verified: true,
    collaborations: 32,
    tags: ['Food', 'Cooking', 'Restaurant'],
    rating: 4.7
  }
];

const categories = ['Tümü', 'Favoriler', 'Teknoloji', 'Moda', 'Sağlık & Spor', 'Yiyecek & İçecek', 'Seyahat', 'Güzellik'];

export default function BrandExplore() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedInfluencers, setSavedInfluencers] = useState<number[]>([2, 5]); // Mock saved
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<typeof mockInfluencers[0] | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [collaborationForm, setCollaborationForm] = useState({
    campaignName: '',
    message: '',
    budget: '',
    deadline: null as Date | null
  });
  
  // 🆕 Gerçek influencer verisi (Instagram API'den)
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fübet (Instagram API) credentials
  const INSTAGRAM_ACCESS_TOKEN = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || "EAAMtZCWmJZBjEBO0zB0iYpfwDq7c8AQsv11brTmrxGtVoZAsC0oLkV0eExnDtAg4TIrTKMJC6lT6yVoawHWGW9M5omw5lPMdQd7vZCMH58tOW3bBSgJ6P2JIzkHiC1a6fLkZBNaOLqr3sBg24UfZAK2ZA47L1n3dD";
  const INSTAGRAM_BUSINESS_ID = process.env.NEXT_PUBLIC_INSTAGRAM_BUSINESS_ID || "17841464952420470";

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
    
    // 🆕 Influencer verilerini API'den çek (Instagram metrics ile)
    fetchInfluencers();
  }, [router]);
  
  // 🆕 Fübet'ten gerçek Instagram verisi + Database'den gerçek influencer'lar
  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      
      // 1️⃣ Fübet'ten GERÇEK Instagram verisi çek (ilk kart için)
      let realInstagramInfluencer = null;
      try {
        console.log('🔍 Instagram API çağrısı başlıyor...');
        
        // A. Profil Bilgileri
        const profileRes = await axios.get(
          `https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ID}`,
          {
            params: {
              fields: 'name,username,biography,followers_count,media_count,profile_picture_url',
              access_token: INSTAGRAM_ACCESS_TOKEN
            }
          }
        );
        const pData = profileRes.data;
        console.log('✅ Profil verisi alındı:', pData);

        // B. Medyalar (son 10 post)
        const mediaRes = await axios.get(
          `https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ID}/media`,
          {
            params: {
              fields: 'id,like_count,comments_count',
              limit: 10,
              access_token: INSTAGRAM_ACCESS_TOKEN
            }
          }
        );
        const mediaData = mediaRes.data.data || [];

        // C. Engagement Rate Hesapla
        let totalLikes = 0;
        let totalComments = 0;
        mediaData.forEach((post: any) => {
          totalLikes += (post.like_count || 0);
          totalComments += (post.comments_count || 0);
        });
        const postCount = mediaData.length || 1;
        const totalInteractions = totalLikes + totalComments;
        const engagementRate = pData.followers_count > 0 
          ? (((totalInteractions / postCount) / pData.followers_count) * 100).toFixed(2)
          : 0;

        // D. Followers formatla
        const formatFollowers = (count: number) => {
          if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
          if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
          return count.toString();
        };

        const followersCount = pData.followers_count || 0;
        const instagramFollowers = formatFollowers(followersCount);

        // E. Gerçek Instagram kartı oluştur
        realInstagramInfluencer = {
          id: 999999, // Özel ID (database'de yok)
          name: pData.name || 'Instagram User',
          username: `@${pData.username}`,
          avatar: pData.profile_picture_url || '',
          category: 'İçerik Üretici',
          bio: pData.biography || 'Instagram Influencer',
          location: 'Türkiye',
          platforms: {
            instagram: { 
              followers: instagramFollowers, 
              engagement: `${engagementRate}%` 
            },
            youtube: { 
              followers: formatFollowers(Math.floor(followersCount * 0.6)),
              engagement: `${(parseFloat(engagementRate.toString()) * 0.8).toFixed(1)}%` 
            },
            tiktok: { 
              followers: formatFollowers(Math.floor(followersCount * 0.4)),
              engagement: `${(parseFloat(engagementRate.toString()) * 1.3).toFixed(1)}%` 
            }
          },
          totalReach: instagramFollowers,
          avgEngagement: `${engagementRate}%`,
          priceRange: `₺${Math.floor(followersCount / 15).toLocaleString('tr-TR')} - ₺${Math.floor(followersCount / 10).toLocaleString('tr-TR')}`,
          verified: true,
          collaborations: Math.floor(followersCount / 5000),
          tags: ['İçerik Üretici', 'Influencer', `${instagramFollowers} takipçi`, '🔥 Gerçek Veri'],
          rating: 4.9,
          isRealData: true // Gerçek veri bayrağı
        };
      } catch (instagramError: any) {
        console.error('❌ Fübet verisi çekilemedi:', instagramError);
        if (instagramError.response) {
          console.error('API Response:', instagramError.response.data);
          console.error('Status:', instagramError.response.status);
        }
      }

      // 2️⃣ Premium Fake Influencer'lar (Demo için)
      const premiumInfluencers = [
        {
          id: 999901,
          name: 'Ayşe Yılmaz',
          username: '@ayse.yilmaz',
          avatar: 'A',
          category: 'Moda & Lifestyle',
          bio: 'Moda tutkunu, stil danışmanı ve içerik üreticisi. Markalarla özgün işbirlikleri yapıyorum.',
          location: 'İstanbul, Türkiye',
          platforms: {
            instagram: { followers: '342K', engagement: '5.8%' },
            youtube: { followers: '205K', engagement: '4.6%' },
            tiktok: { followers: '137K', engagement: '7.5%' }
          },
          totalReach: '684K',
          avgEngagement: '5.8%',
          priceRange: '₺22.800 - ₺34.200',
          verified: true,
          collaborations: 68,
          tags: ['Moda', 'Lifestyle', 'Beauty', '342K takipçi'],
          rating: 4.9,
          isRealData: false
        },
        {
          id: 999902,
          name: 'Mehmet Kaya',
          username: '@mehmet.tech',
          avatar: 'M',
          category: 'Teknoloji',
          bio: 'Teknoloji incelemecisi ve gadget meraklısı. Yeni ürünleri test edip deneyimlerimi paylaşıyorum.',
          location: 'Ankara, Türkiye',
          platforms: {
            instagram: { followers: '256K', engagement: '4.2%' },
            youtube: { followers: '384K', engagement: '5.1%' },
            tiktok: { followers: '102K', engagement: '5.5%' }
          },
          totalReach: '742K',
          avgEngagement: '4.2%',
          priceRange: '₺17.066 - ₺25.600',
          verified: true,
          collaborations: 51,
          tags: ['Teknoloji', 'Gadget', 'Review', '256K takipçi'],
          rating: 4.8,
          isRealData: false
        },
        {
          id: 999903,
          name: 'Zeynep Demir',
          username: '@zeynep.fitness',
          avatar: 'Z',
          category: 'Sağlık & Fitness',
          bio: 'Sertifikalı fitness antrenörü. Sağlıklı yaşam ve egzersiz rutinleri paylaşıyorum.',
          location: 'İzmir, Türkiye',
          platforms: {
            instagram: { followers: '445K', engagement: '6.3%' },
            youtube: { followers: '267K', engagement: '5.0%' },
            tiktok: { followers: '178K', engagement: '8.2%' }
          },
          totalReach: '890K',
          avgEngagement: '6.3%',
          priceRange: '₺29.666 - ₺44.500',
          verified: true,
          collaborations: 89,
          tags: ['Fitness', 'Sağlık', 'Spor', '445K takipçi'],
          rating: 4.9,
          isRealData: false
        },
        {
          id: 999904,
          name: 'Can Özkan',
          username: '@can.food',
          avatar: 'C',
          category: 'Yemek & Gastronomi',
          bio: 'Yemek fotoğrafçısı ve lezzet arayışındaki bir gurme. Restoran tavsiyeleri ve tarifler.',
          location: 'Antalya, Türkiye',
          platforms: {
            instagram: { followers: '198K', engagement: '7.1%' },
            youtube: { followers: '119K', engagement: '5.7%' },
            tiktok: { followers: '79K', engagement: '9.2%' }
          },
          totalReach: '396K',
          avgEngagement: '7.1%',
          priceRange: '₺13.200 - ₺19.800',
          verified: true,
          collaborations: 39,
          tags: ['Yemek', 'Food', 'Gastronomi', '198K takipçi'],
          rating: 4.7,
          isRealData: false
        },
        {
          id: 999905,
          name: 'Elif Arslan',
          username: '@elif.travel',
          avatar: 'E',
          category: 'Seyahat',
          bio: 'Dünya gezgini ve macera avcısı. 47 ülke gezdim, deneyimlerimi sizlerle paylaşıyorum.',
          location: 'İstanbul, Türkiye',
          platforms: {
            instagram: { followers: '567K', engagement: '5.4%' },
            youtube: { followers: '340K', engagement: '4.8%' },
            tiktok: { followers: '227K', engagement: '7.0%' }
          },
          totalReach: '1.1M',
          avgEngagement: '5.4%',
          priceRange: '₺37.800 - ₺56.700',
          verified: true,
          collaborations: 113,
          tags: ['Seyahat', 'Travel', 'Adventure', '567K takipçi'],
          rating: 5.0,
          isRealData: false
        },
        {
          id: 999906,
          name: 'Burak Yıldız',
          username: '@burak.gaming',
          avatar: 'B',
          category: 'Gaming & Espor',
          bio: 'Profesyonel oyuncu ve yayıncı. FPS ve MOBA oyunlarında uzmanım. Twitch: burak_gaming',
          location: 'Bursa, Türkiye',
          platforms: {
            instagram: { followers: '289K', engagement: '4.9%' },
            youtube: { followers: '412K', engagement: '6.2%' },
            tiktok: { followers: '156K', engagement: '6.4%' }
          },
          totalReach: '857K',
          avgEngagement: '4.9%',
          priceRange: '₺19.266 - ₺28.900',
          verified: true,
          collaborations: 57,
          tags: ['Gaming', 'Espor', 'Twitch', '289K takipçi'],
          rating: 4.8,
          isRealData: false
        }
      ];

      // 3️⃣ Database'den gerçek influencer'ları çek
      const response = await axios.get('http://localhost:8000/influencers/list?limit=50');
      
      const apiInfluencers = response.data.map((inf: any) => {
        // Followers formatla
        const formatFollowers = (count: number) => {
          if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
          if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
          return count.toString();
        };
        
        const instagramFollowers = formatFollowers(inf.followers || 0);
        const totalReach = formatFollowers(inf.followers || 0);
        
        return {
          id: inf.id,
          name: inf.display_name,
          username: inf.username,
          avatar: inf.profile_picture || inf.display_name.charAt(0).toUpperCase(),
          category: inf.category || 'Genel',
          bio: inf.bio || 'Henüz bio eklenmemiş.',
          location: inf.location || 'Türkiye',
          platforms: {
            instagram: { 
              followers: instagramFollowers, 
              engagement: `${inf.engagement_rate || 0}%` 
            },
            youtube: { 
              followers: formatFollowers(Math.floor((inf.followers || 0) * 0.6)),
              engagement: `${((inf.engagement_rate || 0) * 0.8).toFixed(1)}%` 
            },
            tiktok: { 
              followers: formatFollowers(Math.floor((inf.followers || 0) * 0.4)),
              engagement: `${((inf.engagement_rate || 0) * 1.3).toFixed(1)}%` 
            }
          },
          totalReach: totalReach,
          avgEngagement: `${inf.engagement_rate || 0}%`,
          priceRange: `₺${Math.floor((inf.followers || 5000) / 15).toLocaleString('tr-TR')} - ₺${Math.floor((inf.followers || 5000) / 10).toLocaleString('tr-TR')}`,
          verified: inf.is_verified,
          collaborations: Math.floor((inf.followers || 0) / 5000),
          tags: [inf.category || 'Genel', 'Influencer', `${instagramFollowers} takipçi`],
          rating: parseFloat((4.0 + Math.random()).toFixed(1)),
          isRealData: false
        };
      });
      
      // 4️⃣ HEPSİNİ BİRLEŞTİR: Fübet → Premium Fake → Database
      const allInfluencers = realInstagramInfluencer 
        ? [realInstagramInfluencer, ...premiumInfluencers, ...apiInfluencers]
        : [...premiumInfluencers, ...apiInfluencers];
      
      setInfluencers(allInfluencers);
    } catch (error) {
      console.error('Influencer verileri yüklenemedi:', error);
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  };

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

  const toggleSaveInfluencer = (influencerId: number) => {
    setSavedInfluencers(prev => 
      prev.includes(influencerId) 
        ? prev.filter(id => id !== influencerId)
        : [...prev, influencerId]
    );
  };

  const openCollaborationModal = (influencer: typeof mockInfluencers[0]) => {
    setSelectedInfluencer(influencer);
    setShowCollaborationModal(true);
  };

  const closeCollaborationModal = () => {
    setShowCollaborationModal(false);
    setSelectedInfluencer(null);
    setCollaborationForm({
      campaignName: '',
      message: '',
      budget: '',
      deadline: null
    });
  };

  const handleCollaborationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Backend API call
    console.log('Collaboration offer sent:', {
      influencer: selectedInfluencer?.id,
      ...collaborationForm
    });
    closeCollaborationModal();
    setShowSuccessModal(true);
    
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'tiktok': return <Music2 className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  // Filter influencers - 🆕 Artık gerçek API verisini kullanıyoruz
  const filteredInfluencers = influencers.filter(influencer => {
    // Favoriler filtresi
    if (selectedCategory === 'Favoriler') {
      const isSaved = savedInfluencers.includes(influencer.id);
      const matchesSearch = influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           influencer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           influencer.bio.toLowerCase().includes(searchQuery.toLowerCase());
      return isSaved && matchesSearch;
    }
    
    // Diğer kategoriler
    const matchesCategory = selectedCategory === 'Tümü' || influencer.category === selectedCategory;
    const matchesSearch = influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         influencer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         influencer.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 🆕 Loading spinner göster
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-inter">Instagram verileri yükleniyor...</p>
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
                className="text-[#1A2A6C] dark:text-white hover:text-[#7C3AED] dark:hover:text-[#A78BFA] font-semibold transition-colors border-b-2 border-[#1A2A6C] dark:border-white pb-1"
              >
                Keşfet
              </Link>
              <Link 
                href="/brand/collaborations"
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
                    {companyName.charAt(0)}
                  </div>
                  <span className="font-semibold font-jakarta hidden sm:inline">{companyName}</span>
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
                href="/brand/explore"
                onClick={() => setShowMobileMenu(false)}
                className="flex px-4 py-3 text-[#1A2A6C] dark:text-white bg-gray-100 dark:bg-slate-700 rounded-lg font-semibold font-inter"
              >
                Keşfet
              </Link>
              <Link
                href="/brand/collaborations"
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
            <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A2A6C] dark:text-white font-jakarta">
              Influencer Keşfet
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-inter">
            Markanıza uygun influencer'ları bulun ve işbirliği teklifi gönderin
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
              placeholder="Influencer ara..."
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
                      {category === 'Favoriler' && savedInfluencers.length > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          selectedCategory === category
                            ? 'bg-white/20 text-white'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          {savedInfluencers.length}
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
          <span className="font-semibold">{filteredInfluencers.length} influencer bulundu</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{filteredInfluencers.filter(i => i.verified).length} doğrulanmış</span>
        </motion.div>

        {/* Influencer Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInfluencers.map((influencer, index) => (
            <motion.div
              key={influencer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border transition-all cursor-pointer ${
                influencer.isRealData 
                  ? 'border-2 border-orange-500 dark:border-orange-400 shadow-2xl shadow-orange-500/30 dark:shadow-orange-500/40 hover:shadow-3xl hover:shadow-orange-500/40' 
                  : 'border-gray-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20'
              }`}
            >
              {/* Real Data Badge */}
              {influencer.isRealData && (
                <div className="mb-3 flex items-center justify-center">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold font-jakarta shadow-lg flex items-center space-x-1 animate-pulse">
                    <span>🔥</span>
                    <span>GERÇEK FÜBET VERİSİ</span>
                  </span>
                </div>
              )}
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {influencer.avatar && influencer.avatar.startsWith('http') ? (
                    <img 
                      src={influencer.avatar} 
                      alt={influencer.name}
                      className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl shadow-lg text-white font-bold">
                      {influencer.avatar}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                        {influencer.name}
                      </h3>
                      {influencer.verified && (
                        <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                      {influencer.username}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold font-inter">
                        {influencer.category}
                      </span>
                      <span className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 font-inter">
                        <span>⭐</span>
                        <span>{influencer.rating}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={() => toggleSaveInfluencer(influencer.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      savedInfluencers.includes(influencer.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* Bio */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 font-inter line-clamp-2">
                {influencer.bio}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
                  <div className="text-lg font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                    {influencer.totalReach}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-inter">
                    Toplam Erişim
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
                  <div className="text-lg font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                    {influencer.avgEngagement}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-inter">
                    Etkileşim
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
                  <div className="text-lg font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                    {influencer.collaborations}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-inter">
                    İşbirliği
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {Object.entries(influencer.platforms).map(([platform, data]) => {
                  const platformData = data as { followers: string; engagement: string };
                  return (
                    <div
                      key={platform}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 font-inter"
                    >
                      {getPlatformIcon(platform)}
                      <div className="flex flex-col">
                        <span>{platformData.followers}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">{platformData.engagement}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {influencer.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-inter"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Price and Location */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 font-inter">
                  <MapPin className="w-4 h-4" />
                  <span>{influencer.location}</span>
                </div>
                <div className="text-green-600 dark:text-green-400 font-semibold font-inter">
                  {influencer.priceRange}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Link
                  href={`/dashboard/messages?userId=${influencer.id}&name=${encodeURIComponent(influencer.name)}`}
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50 transition-all flex items-center justify-center space-x-2 font-jakarta"
                >
                  <span>Mesaj Gönder</span>
                  <Send className="w-4 h-4" />
                </Link>
              <button 
                onClick={() => openCollaborationModal(influencer)}
                  className="w-full py-3 px-6 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all flex items-center justify-center space-x-2 font-jakarta"
              >
                <span>İşbirliği Teklifi Gönder</span>
                <Send className="w-4 h-4" />
              </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredInfluencers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
              Influencer Bulunamadı
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-inter">
              Arama kriterlerinize uygun influencer bulunmamaktadır
            </p>
          </motion.div>
        )}
      </main>

      {/* Collaboration Modal */}
      <AnimatePresence>
        {showCollaborationModal && selectedInfluencer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCollaborationModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white p-6 rounded-t-3xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                        {selectedInfluencer.avatar}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold font-jakarta">{selectedInfluencer.name}</h2>
                        <p className="text-white/80 font-inter">{selectedInfluencer.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={closeCollaborationModal}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <CloseIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleCollaborationSubmit} className="p-6">
                  <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">
                    İşbirliği Teklifi
                  </h3>

                  {/* Campaign Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                      Kampanya Adı
                    </label>
                    <input
                      type="text"
                      required
                      value={collaborationForm.campaignName}
                      onChange={(e) => setCollaborationForm({ ...collaborationForm, campaignName: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter"
                      placeholder="Örn: Yeni Ürün Lansmanı"
                    />
                  </div>

                  {/* Message */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                      Mesajınız
                    </label>
                    <textarea
                      required
                      value={collaborationForm.message}
                      onChange={(e) => setCollaborationForm({ ...collaborationForm, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter resize-none"
                      placeholder="İşbirliği detaylarını ve beklentilerinizi açıklayın..."
                    />
                  </div>

                  {/* Budget & Deadline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                        Bütçe
                      </label>
                      <input
                        type="text"
                        required
                        value={collaborationForm.budget}
                        onChange={(e) => setCollaborationForm({ ...collaborationForm, budget: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter"
                        placeholder="₺10,000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                        Son Tarih
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <DatePicker
                          selected={collaborationForm.deadline}
                          onChange={(date: Date | null) => setCollaborationForm({ ...collaborationForm, deadline: date })}
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
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={closeCollaborationModal}
                      className="flex-1 py-3 px-6 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all font-jakarta"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50 transition-all flex items-center justify-center space-x-2 font-jakarta"
                    >
                      <span>Teklif Gönder</span>
                      <Send className="w-4 h-4" />
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
                    Teklif Gönderildi! 🎉
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-gray-600 dark:text-gray-300 font-inter"
                  >
                    Influencer en kısa sürede size dönüş yapacaktır.
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
