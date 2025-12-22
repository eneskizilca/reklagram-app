'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { motion } from 'framer-motion';

// 👇 CÜZDAN IMPORT EDİLDİ (Arkadaşının eklediği)
import WalletCard from "@/components/dashboard/WalletCard";

import { 
  FileText, LogOut, Download, Share2, Instagram, Youtube, Music2, 
  TrendingUp, Tag, Mail, MapPin, CheckCircle2, Edit3, X, 
  ChevronDown, Check, Menu, Loader2
} from 'lucide-react';

import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

// Başlangıç State'i (Hem senin hem arkadaşının veri yapısını destekler)
const initialProfile = {
  username: "yukleniyor...",
  display_name: "Yükleniyor",
  email: "",
  bio: "Veriler Instagram'dan çekiliyor...",
  category: "İçerik Üretici",
  location: "Konum Yok",
  profilePhoto: "/reklagram-logo.png",
  followers: 0,
  engagement_rate: 0,
  avg_likes: 0,
  avg_comments: 0,
  // Grafikler için veri yapıları
  growth_history: [],
  demographics: [], // Yaş dağılımı (BarChart için)
  gender_demographics: [], // Cinsiyet dağılımı
  recent_posts: [],
  connected_accounts: {
    instagram: { connected: false, username: "", followers: 0 },
    youtube: { connected: false, username: "", followers: 0 },
    tiktok: { connected: false, username: "", followers: 0 }
  }
};

export default function InfluencerProfile() {
  const router = useRouter();
  
  // --- STATE TANIMLARI ---
  const [profile, setProfile] = useState<any>(initialProfile);
  const [userName, setUserName] = useState('');
  
  // UI State'leri
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // PDF Loading state

  // Form State (Düzenleme Modalı için)
  const [editForm, setEditForm] = useState<any>({});

  // Token Yönetimi
  const [accessToken, setAccessToken] = useState(process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || "");
  const INSTAGRAM_BUSINESS_ID = process.env.NEXT_PUBLIC_INSTAGRAM_BUSINESS_ID || "17841464952420470";

  // Kategoriler
  const categories = [
    { value: 'Sanat & Yaratıcılık', icon: '🎨' },
    { value: 'Teknoloji', icon: '💻' },
    { value: 'Moda', icon: '👗' },
    { value: 'Seyahat', icon: '✈️' },
    { value: 'Eğitim', icon: '📚' }
  ];

  // 1. BAŞLANGIÇ AYARLARI (Auth Kontrolü)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    const email = localStorage.getItem('user_email');
    
    // Test amaçlı localden token kontrolü
    const instaToken = localStorage.getItem('instagram_access_token');
    if (instaToken) setAccessToken(instaToken);

    if (!token || role !== 'influencer') {
      router.push('/login');
      return;
    }

    if (email) {
      const name = email.split('@')[0];
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      setProfile((prev: any) => ({ ...prev, email: email }));
    }
  }, [router]);

  // 2. INSTAGRAM VERİSİNİ ÇEKME (Senin kodun - Logic)
  useEffect(() => {
    if (accessToken) {
      fetchInstagramData();
    }
  }, [accessToken]);

  const fetchInstagramData = async () => {
    try {
      // A. Profil Bilgileri
      const profileRes = await axios.get(`https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ID}?fields=name,username,biography,followers_count,media_count,profile_picture_url&access_token=${accessToken}`);
      const pData = profileRes.data;

      // B. Medyalar
      const mediaRes = await axios.get(`https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ID}/media?fields=id,caption,media_type,like_count,comments_count,thumbnail_url,media_url,timestamp&limit=10&access_token=${accessToken}`);
      const mediaData = mediaRes.data.data;

      // C. Demografi (Hata yönetimi ile)
      let demographicsRaw = [];
      try {
        const insightsRes = await axios.get(`https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ID}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=age,gender&access_token=${accessToken}`);
        demographicsRaw = insightsRes.data.data[0].total_value.breakdowns[0].results;
      } catch (err) {
        console.log("Demografi verisi çekilemedi, mock veri kullanılacak.");
      }

      // --- HESAPLAMALAR ---
      let totalLikes = 0; 
      let totalComments = 0;
      mediaData.forEach((post: any) => {
        totalLikes += (post.like_count || 0);
        totalComments += (post.comments_count || 0);
      });
      const totalInteractions = totalLikes + totalComments;
      const postCount = mediaData.length || 1;
      
      const engagementRate = pData.followers_count > 0 
        ? (( (totalInteractions/postCount) / pData.followers_count) * 100).toFixed(2) 
        : 0;

      // Demografi İşleme
      let totalAudience = 0;
      let womenCount = 0;
      let menCount = 0;
      const ageGroups: any = {};

      if (demographicsRaw.length > 0) {
        demographicsRaw.forEach((item: any) => {
          const age = item.dimension_values[0]; 
          const gender = item.dimension_values[1];
          const val = item.value;

          totalAudience += val;
          if (gender === 'F') womenCount += val;
          if (gender === 'M') menCount += val;

          if (!ageGroups[age]) ageGroups[age] = 0;
          ageGroups[age] += val;
        });
      } else {
        // Mock veri (Chart boş kalmasın diye)
        totalAudience = 100; womenCount = 60; menCount = 40;
        ageGroups["18-24"] = 45; ageGroups["25-34"] = 35; ageGroups["35-44"] = 15;
      }

      const womenPercent = Math.round((womenCount / totalAudience) * 100);
      const menPercent = Math.round((menCount / totalAudience) * 100);
      
      // Arkadaşının BarChart yapısına uygun veri dönüşümü
      const demographicsChartData = Object.entries(ageGroups)
        .map(([range, val]: any) => ({
          age: range,
          percentage: Math.round((val / totalAudience) * 100)
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);

      // --- STATE GÜNCELLEME ---
      setProfile((prev: any) => ({
        ...prev,
        username: pData.username,
        display_name: pData.name,
        bio: pData.biography,
        profilePhoto: pData.profile_picture_url,
        followers: pData.followers_count,
        engagement_rate: engagementRate,
        avg_likes: Math.round(totalLikes / postCount),
        avg_comments: Math.round(totalComments / postCount),
        recent_posts: mediaData.slice(0, 3),
        
        // Grafikler için veriler
        demographics: demographicsChartData,
        gender_demographics: [
            { gender: 'Kadın', percentage: womenPercent },
            { gender: 'Erkek', percentage: menPercent }
        ],
        // Bağlı hesap durumu (Instagram bağlı kabul ediyoruz token varsa)
        connected_accounts: {
            ...prev.connected_accounts,
            instagram: { connected: true, username: pData.username, followers: pData.followers_count }
        }
      }));

      // Edit Formunu da güncelle
      setEditForm({
        display_name: pData.name,
        bio: pData.biography,
        category: "İçerik Üretici",
        location: "Türkiye",
        instagram_username: pData.username,
        youtube_username: "",
        tiktok_username: ""
      });

    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  // 3. MEDIA KIT İNDİRME (Senin kodun - Real Function)
  const handleDownloadMediaKit = async () => {
    try {
      setIsGenerating(true);

      if (!profile.username || profile.username === "yukleniyor...") {
        alert("Veriler yüklenmedi!");
        return;
      }

      const formatNumber = (num: number) => num > 999 ? (num / 1000).toFixed(1) + "K" : num.toString();

      const mediaKitPayload = {
        displayName: profile.display_name,
        username: profile.username,
        bio: profile.bio || "İçerik Üreticisi",
        profileImage: profile.profilePhoto,
        followers: formatNumber(profile.followers),
        engagementRate: profile.engagement_rate,
        avgLikes: formatNumber(profile.avg_likes),       
        avgComments: profile.avg_comments?.toString() || "0", 
        contactEmail: profile.email,
        recentPosts: profile.recent_posts?.map((post: any) => ({
          imageUrl: post.thumbnail_url || post.media_url,
          likes: post.like_count || 0,
          comments: post.comments_count || 0
        })) || [],
        
        // PDF servisine uygun formatta gönderim
        audienceGender: { women: profile.gender_demographics[0]?.percentage || 50, men: profile.gender_demographics[1]?.percentage || 50 },
        audienceAge: profile.demographics.map((d: any) => ({ range: d.age, percent: d.percentage }))
      };

      const response = await fetch("/api/generate-mediakit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mediaKitPayload),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      window.open(data.url, "_blank");

    } catch (error: any) {
      console.error(error);
      alert("Hata: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // 4. UI HANDLERS (Arkadaşının kodları)
  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const handleEditProfile = () => setShowEditModal(true);
  
  const handleSaveProfile = () => {
    // Sadece UI'da günceller, backend update eklenebilir
    setProfile((prev: any) => ({
      ...prev,
      display_name: editForm.display_name,
      bio: editForm.bio,
      location: editForm.location,
      category: editForm.category
    }));
    setShowEditModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (category: string) => {
    setEditForm({ ...editForm, category: category });
    setShowCategoryDropdown(false);
  };

  const handleConnectAccount = (platform: string) => {
    if (platform === 'Instagram') {
      const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI;
      
      // ✅ DÜZELTİLEN KISIM BURASI:
      // 'business_management' sildik. (Hata veren oydu)
      // 'pages_read_engagement' ekledik. (Sayfa listesini çekmek için bu yeterli)
      const scope = "instagram_basic,pages_show_list,instagram_manage_insights,pages_read_engagement";

      if (!clientId || !redirectUri) {
        alert("Frontend .env ayarları eksik!");
        return;
      }

      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

      window.location.href = authUrl;
    }
  };

  // Dropdown dışına tıklama kontrolü
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCategoryDropdown && !target.closest('.category-dropdown-container')) {
        setShowCategoryDropdown(false);
      }
    };
    if (showCategoryDropdown) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showCategoryDropdown]);


  // --- RENDER ---
  return (
    <div className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-[#F8F9FD] dark:bg-slate-900`}>
      {/* NAVBAR (Arkadaşının güzel tasarımı) */}
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
                <Image src="/reklagram-logo.png" alt="ReklaGram" width={40} height={40} className="object-contain" />
              </div>
              <span className="text-xl font-bold text-[#1A2A6C] dark:text-white font-jakarta">ReklaGram</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6 font-inter">
              <Link href="/influencer/explore" className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors">Keşfet</Link>
              <Link href="/influencer/collaborations" className="text-gray-700 dark:text-gray-300 hover:text-[#1A2A6C] dark:hover:text-white font-medium transition-colors">İşbirliklerim</Link>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 rounded-lg cursor-pointer">
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="relative profile-menu-container">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white hover:shadow-lg transition-all cursor-pointer">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    {userName.charAt(0)}
                  </div>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border overflow-hidden">
                     <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50">
                       <LogOut className="w-4 h-4 mr-2" /> Çıkış Yap
                     </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ANA İÇERİK */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-[#1A2A6C] dark:text-white mb-2 font-jakarta">Profilim & Media Kit</h1>
          <p className="text-gray-600 dark:text-gray-300 font-inter">İstatistiklerini yönet ve Media Kit'ini oluştur</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL KOLON: PROFİL KARTI */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-lg sticky top-24">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1A2A6C] via-[#7C3AED] to-[#F97316] p-1">
                     <img src={profile.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover bg-white" />
                  </div>
                  <button onClick={handleEditProfile} className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all cursor-pointer shadow-md">
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#1A2A6C] dark:text-white mb-1 font-jakarta">{profile.display_name}</h2>
                <p className="text-gray-600 dark:text-gray-300 font-inter">@{profile.username}</p>
                {!accessToken && <p className="text-xs text-red-500 mt-2">(Token Girilmedi)</p>}
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 font-inter text-center">{profile.bio}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-inter">{profile.category}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-inter">{profile.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-jakarta">{(profile.followers / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 font-inter">Takipçi</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-jakarta">%{profile.engagement_rate}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 font-inter">Etkileşim</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SAĞ KOLON: İÇERİK */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. CÜZDAN KARTI (YENİ EKLENEN) */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
               {/* WalletCard içine userType prop'u gönderiyoruz */}
               <WalletCard userType="influencer" />
            </motion.div>

            {/* 2. MEDIA KIT KARTI (Senin işlevsel kodun + Arkadaşının tasarımı) */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Media Kit 2025</h3>
                  <p className="text-blue-100 text-sm">Canlı Instagram verilerinle profesyonel PDF oluştur.</p>
                </div>
                <FileText className="w-12 h-12 opacity-50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleDownloadMediaKit} disabled={isGenerating || !accessToken} className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-4 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Hazırlanıyor...</> : <><Download className="w-5 h-5" /> Media Kit İndir (PDF)</>}
                </button>
                <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl py-4 font-semibold transition-all">
                  <Share2 className="w-5 h-5" /> Paylaş
                </button>
              </div>
            </motion.div>

            {/* 3. GRAFİKLER (Arkadaşının tasarımı + Senin Verilerin) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Yaş Dağılımı */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 shadow-lg">
                <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">Yaş Dağılımı</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={profile.demographics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="age" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                    <Bar dataKey="percentage" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Cinsiyet Dağılımı */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 shadow-lg">
                <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">Cinsiyet Dağılımı</h3>
                <div className="space-y-4 pt-4">
                  {profile.gender_demographics.map((item: any) => (
                    <div key={item.gender}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-inter">{item.gender}</span>
                        <span className="text-sm font-bold text-[#1A2A6C] dark:text-white font-jakarta">%{item.percentage}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                        <div className={`h-3 rounded-full ${item.gender === 'Kadın' ? 'bg-pink-500' : 'bg-blue-500'}`} style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.7 }} 
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 shadow-lg"
            >
              <h3 className="text-xl font-bold text-[#1A2A6C] dark:text-white mb-6 font-jakarta">Bağlı Hesaplar</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 font-jakarta">
                        {profile.connected_accounts.instagram.username || "Instagram"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {profile.connected_accounts.instagram.connected ? 'Bağlandı' : 'Bağlı Değil'}
                      </div>
                    </div>
                  </div>
                  
                  {/* SAĞ TARAF: Hem Tik (varsa) Hem Buton */}
                  <div className="flex items-center space-x-3">
                    {profile.connected_accounts.instagram.connected && (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                    
                    <button 
                      onClick={() => handleConnectAccount('Instagram')} 
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors text-white rounded-lg text-sm font-medium"
                    >
                      {profile.connected_accounts.instagram.connected ? 'Yenile' : 'Bağla'}
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      {/* MODAL (Arkadaşının tasarımı) */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#1A2A6C] dark:text-white font-jakarta">Profili Düzenle</h2>
              <button onClick={() => setShowEditModal(false)}><X className="w-6 h-6 text-gray-600" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Görünen Ad</label>
                <input type="text" name="display_name" value={editForm.display_name || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Biyografi</label>
                <textarea name="bio" value={editForm.bio || ''} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 border rounded-xl" />
              </div>
              <div className="category-dropdown-container relative">
                <label className="block text-sm font-semibold mb-2">Kategori</label>
                <button type="button" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="w-full px-4 py-3 border rounded-xl flex justify-between items-center bg-white">
                  <span>{editForm.category}</span>
                  <ChevronDown className="w-5 h-5" />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white border rounded-xl shadow-xl">
                    {categories.map((cat) => (
                      <button key={cat.value} type="button" onClick={() => handleCategorySelect(cat.value)} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex gap-2">
                        <span>{cat.icon}</span>{cat.value}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-4">
              <button onClick={() => setShowEditModal(false)} className="px-6 py-3 border rounded-xl">İptal</button>
              <button onClick={handleSaveProfile} className="px-6 py-3 bg-[#1A2A6C] text-white rounded-xl">Kaydet</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}