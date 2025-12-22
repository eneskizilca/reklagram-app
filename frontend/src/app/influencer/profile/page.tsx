'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios'; // Veri çekmek için axios ekledik
import { motion } from 'framer-motion';
// 👇 CÜZDAN IMPORT EDİLDİ
import WalletCard from "@/components/dashboard/WalletCard";
import { 
<<<<<<< HEAD
  FileText, LogOut, Download, Share2, Instagram, Youtube, Music2, 
  TrendingUp, Mail, MapPin, Tag, Edit3, X, ChevronDown, Check, Menu, Loader2 
=======
  FileText, 
  LogOut,
  Download,
  Share2,
  Instagram,
  Youtube,
  Music2,
  TrendingUp,
  Tag,
  Mail,
  MapPin,
  CheckCircle2,
  Edit3,
  X,
  ChevronDown,
  Check,
  Menu
>>>>>>> 6748354 (feat: Cüzdan sistemi ve temizlik çalışmaları yeni branch'e taşındı)
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

// Başlangıç için boş/mock veri (Veri gelene kadar görünür)
const initialProfile = {
  username: "yukleniyor...",
  display_name: "Yükleniyor",
  email: "",
  bio: "Veriler Instagram'dan çekiliyor...",
  category: "İçerik Üretici",
  location: "Konum Yok",
  profilePhoto: "/reklagram-logo.png", // Varsayılan logo
  followers: 0,
  engagement_rate: 0,
  avg_views: 0,
  connected_accounts: {
    instagram: { connected: false, username: "", followers: 0 },
    youtube: { connected: false, username: "", followers: 0 },
    tiktok: { connected: false, username: "", followers: 0 }
  },
  growth_history: [],
  demographics: [],
  gender_demographics: []
};

export default function InfluencerProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(initialProfile);
  const [userName, setUserName] = useState('');
  
  // UI State'leri
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // PDF Loading state

  // Form State
  const [editForm, setEditForm] = useState<any>({});

  // Instagram Access Token (Veritabanından veya LocalStorage'dan gelmeli)
  // NOT: Gerçek projede bu token'ı backend'den güvenli şekilde almalısın.
  // Test için buraya yapıştırabilirsin veya login sırasında localStorage'a kaydedebilirsin.
  // 1. Token'ı direkt .env dosyasından varsayılan olarak alıyoruz
  const [accessToken, setAccessToken] = useState(process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || "");
  // 2. Business ID'yi de .env'den çekiyoruz (Yoksa kodun içindekini kullanır)
  const INSTAGRAM_BUSINESS_ID = process.env.NEXT_PUBLIC_INSTAGRAM_BUSINESS_ID || "17841464952420470";

  // Kategoriler
  const categories = [
    { value: 'Sanat & Yaratıcılık', icon: '🎨' },
    { value: 'Teknoloji', icon: '💻' },
    { value: 'Moda', icon: '👗' },
    { value: 'Seyahat', icon: '✈️' },
    { value: 'Eğitim', icon: '📚' }
  ];

  // 1. BAŞLANGIÇ AYARLARI
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    const email = localStorage.getItem('user_email');
    
    // Test amaçlı localden Instagram token'ı alıyoruz
    // Normalde login olunca bu token'ı kaydetmiş olman lazım
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

  // 2. INSTAGRAM VERİSİNİ ÇEKME (Sayfa Yüklendiğinde veya Token Gelince)
  useEffect(() => {
    if (accessToken) {
      fetchInstagramData();
    }
  }, [accessToken]);

  const fetchInstagramData = async () => {
    try {
      // 1. Profil Bilgileri
      const profileRes = await axios.get(`https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ID}?fields=name,username,biography,followers_count,media_count,profile_picture_url&access_token=${accessToken}`);
      const pData = profileRes.data;

      // 2. Son Medyalar (Etkileşim için)
      const mediaRes = await axios.get(`https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ID}/media?fields=id,caption,media_type,like_count,comments_count,thumbnail_url,media_url,timestamp&limit=10&access_token=${accessToken}`);
      const mediaData = mediaRes.data.data;

      // 3. Demografi Verisi (YENİ!)
      // Not: Hesabın 100 takipçi altındaysa bu veri boş dönebilir, hata vermesin diye try-catch ekleyelim.
      let demographicsRaw = [];
      try {
        const insightsRes = await axios.get(`https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ID}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=age,gender&access_token=${accessToken}`);
        demographicsRaw = insightsRes.data.data[0].total_value.breakdowns[0].results;
      } catch (err) {
        console.log("Demografi verisi çekilemedi (takipçi az olabilir). Mock veri kullanılacak.");
      }

      // --- HESAPLAMALAR ---

      // A. Etkileşim Hesaplama
      let totalInteractions = 0;
      let totalLikes = 0;
      let totalComments = 0;
      mediaData.forEach((post: any) => {
        totalLikes += (post.like_count || 0);
        totalComments += (post.comments_count || 0);
      });
      totalInteractions = totalLikes + totalComments;
      const postCount = mediaData.length || 1;
      
      const engagementRate = pData.followers_count > 0 
        ? (( (totalInteractions/postCount) / pData.followers_count) * 100).toFixed(2) 
        : 0;

      // B. Demografi İşleme (YENİ!)
      let totalAudience = 0;
      let womenCount = 0;
      let menCount = 0;
      const ageGroups: any = {};

      if (demographicsRaw.length > 0) {
        demographicsRaw.forEach((item: any) => {
          const age = item.dimension_values[0]; // "18-24"
          const gender = item.dimension_values[1]; // "F" or "M"
          const val = item.value;

          totalAudience += val;
          if (gender === 'F') womenCount += val;
          if (gender === 'M') menCount += val;

          // Yaş gruplarını topla
          if (!ageGroups[age]) ageGroups[age] = 0;
          ageGroups[age] += val;
        });
      } else {
        // Eğer veri gelmezse (100 takipçi altı), örnek veri koy ki PDF bozuk çıkmasın
        totalAudience = 100; womenCount = 60; menCount = 40;
        ageGroups["18-24"] = 45; ageGroups["25-34"] = 35; ageGroups["35-44"] = 15;
      }

      // Oranlara Çevir
      const womenPercent = Math.round((womenCount / totalAudience) * 100);
      const menPercent = Math.round((menCount / totalAudience) * 100);
      
      // Yaşları formatla ve sırala (En büyük 4 grup)
      const sortedAge = Object.entries(ageGroups)
        .map(([range, val]: any) => ({
          range,
          percent: Math.round((val / totalAudience) * 100)
        }))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 4);

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
        
        // İşlenmiş Demografi verilerini state'e atıyoruz
        demographics_gender: { women: womenPercent, men: menPercent },
        demographics_age: sortedAge
      }));

    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  // 3. MEDIA KIT İNDİRME BUTONU (Verilerle Beraber)
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

        // YENİ GÖNDERİLEN KISIM:
        audienceGender: profile.demographics_gender || { women: 50, men: 50 },
        audienceAge: profile.demographics_age || [{ range: 'Veri Yok', percent: 0 }]
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

  const handleLogout = () => {
<<<<<<< HEAD
    localStorage.clear();
    router.push('/login');
  };

  // --- HTML KISMI (Render) ---
  return (
    <div className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-[#F8F9FD] dark:bg-slate-900`}>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
           <Link href="/influencer/home" className="flex items-center space-x-3">
              <Image src="/reklagram-logo.png" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold text-[#1A2A6C] font-jakarta">ReklaGram</span>
           </Link>
           
           <div className="flex items-center gap-4">
             {/* Token Girişi (Test İçin - İlerde Kaldırılabilir) */}
             {!accessToken && (
               <input 
                 type="text" 
                 placeholder="Access Token Yapıştır" 
                 className="hidden md:block px-3 py-1 border rounded text-xs"
                 onChange={(e) => {
                   localStorage.setItem('instagram_access_token', e.target.value);
                   setAccessToken(e.target.value);
                 }}
               />
             )}
             
             <div className="relative profile-menu-container">
               <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center space-x-2">
                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
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
      </nav>

      {/* ANA İÇERİK */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-[#1A2A6C] dark:text-white mb-2 font-jakarta">Profilim & Media Kit</h1>
          <p className="text-gray-600">Gerçek zamanlı Instagram verilerinle profesyonel kitini oluştur.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL KOLON: PROFİL KARTI */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border shadow-lg sticky top-24">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full p-1 bg-linear-to-br from-[#1A2A6C] via-[#7C3AED] to-[#F97316]">
                  <img src={profile.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover bg-white" />
=======
    localStorage.removeItem('access_token');
    localStorage.removeItem('token'); // 👈 BUNU EKLE (Eski kalıntıları siler)
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
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {userName.charAt(0)}
>>>>>>> 6748354 (feat: Cüzdan sistemi ve temizlik çalışmaları yeni branch'e taşındı)
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#1A2A6C]">{profile.display_name}</h2>
                <p className="text-gray-600">@{profile.username}</p>
                {!accessToken && <p className="text-xs text-red-500 mt-2">(Token Girilmedi)</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">{(profile.followers / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-gray-600">Takipçi</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">%{profile.engagement_rate}</div>
                  <div className="text-xs text-gray-600">Etkileşim</div>
                </div>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* SAĞ KOLON: MEDIA KIT BUTONU VE DETAYLAR */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* MEDIA KIT KARTI */}
            <div className="bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-3xl p-8 text-white shadow-xl">
              <div className="flex justify-between items-center mb-6">
=======
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-linear-to-br from-[#1A2A6C] via-[#7C3AED] to-[#F97316] p-1">
                    <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                      <div className="text-5xl font-bold text-[#1A2A6C] dark:text-white">
                        {profile.display_name.charAt(0)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleEditProfile}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all cursor-pointer shadow-md"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#1A2A6C] dark:text-white mb-1 font-jakarta">
                  {profile.display_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 font-inter">
                  @{profile.username}
                </p>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 font-inter text-center">
                {profile.bio}
              </p>

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
            
            {/* 💳 CÜZDAN KARTI - INFLUENCER MODU (PARA ÇEK) 💳 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <WalletCard userType="influencer" />
            </motion.div>

            {/* Media Kit Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-3xl p-8 text-white shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
>>>>>>> 6748354 (feat: Cüzdan sistemi ve temizlik çalışmaları yeni branch'e taşındı)
                <div>
                  <h3 className="text-2xl font-bold mb-1">Media Kit 2025</h3>
                  <p className="text-blue-100 text-sm">Canlı Instagram verilerinle PDF oluştur.</p>
                </div>
                <FileText className="w-12 h-12 opacity-50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleDownloadMediaKit}
                  disabled={isGenerating || !accessToken}
                  className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-4 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Hazırlanıyor...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Media Kit İndir (PDF)
                    </>
                  )}
                </button>
                <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl py-4 font-semibold transition-all">
                  <Share2 className="w-5 h-5" />
                  Paylaş
                </button>
              </div>
<<<<<<< HEAD
            </div>

            {/* SON GÖNDERİLER (ÖNİZLEME) */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border">
              <h3 className="text-lg font-bold text-[#1A2A6C] mb-4">Media Kit İçeriği (Önizleme)</h3>
              <div className="grid grid-cols-3 gap-4">
                {profile.recent_posts && profile.recent_posts.length > 0 ? (
                  profile.recent_posts.map((post: any) => (
                    <div key={post.id} className="aspect-square relative rounded-xl overflow-hidden group">
                      <img src={post.thumbnail_url || post.media_url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-2">
                        <span>❤️ {post.like_count}</span>
                        <span>💬 {post.comments_count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm col-span-3 text-center py-4">Veriler yükleniyor veya bulunamadı.</p>
                )}
=======

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-blue-100 font-inter">
                  ✨ Media Kit'iniz son 7 gün önce güncellendi. Güncel tutmak için hesaplarınızı yeniden bağlayın.
                </p>
              </div>
            </motion.div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
>>>>>>> 6748354 (feat: Cüzdan sistemi ve temizlik çalışmaları yeni branch'e taşındı)
              </div>
            </div>

          </div>
        </div>
      </main>
<<<<<<< HEAD
=======

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin"
          >
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

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">
                  Kişisel Bilgiler
                </h3>
                <div className="space-y-4">
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

              <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white mb-4 font-jakarta">
                  Sosyal Medya Hesapları
                </h3>
                <div className="space-y-4">
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
>>>>>>> 6748354 (feat: Cüzdan sistemi ve temizlik çalışmaları yeni branch'e taşındı)
    </div>
  );
}