'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios'; // Veri çekmek için axios ekledik
import { motion } from 'framer-motion';
import { 
  FileText, LogOut, Download, Share2, Instagram, Youtube, Music2, 
  TrendingUp, Mail, MapPin, Tag, Edit3, X, ChevronDown, Check, Menu, Loader2 
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

          {/* SAĞ KOLON: MEDIA KIT BUTONU VE DETAYLAR */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* MEDIA KIT KARTI */}
            <div className="bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-3xl p-8 text-white shadow-xl">
              <div className="flex justify-between items-center mb-6">
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
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}