"use client";

import { useState } from "react";
import axios from "axios";
import { 
  Search, BarChart3, Users, Image as ImageIcon, Activity, 
  Heart, MessageCircle, Play, TrendingUp, Eye 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TestInstagramPage() {
  const INSTAGRAM_BUSINESS_ID = "17841464952420470";

  const [accessToken, setAccessToken] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("basic");

  const QUERY_OPTIONS = [
    {
      id: "basic",
      label: "Temel Profil Bilgileri",
      icon: <Users className="w-4 h-4" />,
      fields: "name,username,biography,followers_count,media_count,profile_picture_url",
      description: "Profil fotosu, takipçi sayısı, biyo."
    },
    {
      id: "media",
      label: "Son Gönderiler & Reels",
      icon: <ImageIcon className="w-4 h-4" />,
      endpointSuffix: "/media",
      fields: "id,caption,media_type,media_product_type,like_count,comments_count,permalink,thumbnail_url,media_url,timestamp",
      description: "Son paylaşılanların görsel galerisi."
    },
    {
      id: "demographics",
      label: "Kitle Demografisi",
      icon: <Users className="w-4 h-4" />,
      endpointSuffix: "/insights",
      params: "&metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=age,gender",
      description: "Yaş ve Cinsiyet dağılımı (Grafik)."
    },
    {
      id: "reach_daily",
      label: "Günlük Erişim (Reach)",
      icon: <TrendingUp className="w-4 h-4" />,
      endpointSuffix: "/insights",
      params: "&metric=reach&period=day",
      description: "Son günlerdeki tekil erişim sayısı."
    },
    {
      id: "interactions_total",
      label: "Profil Etkileşimleri",
      icon: <Activity className="w-4 h-4" />,
      endpointSuffix: "/insights",
      // Buradaki metric_type=total_value parametresi yapıyı değiştirdiği için fonksiyonu güncelledik
      params: "&metric=total_interactions,profile_views&period=day&metric_type=total_value",
      description: "Toplam etkileşim ve ziyaretler."
    }
  ];

  // --- YARDIMCI FONKSİYONLAR ---

  const processDemographicsData = (apiData: any) => {
    if (!apiData?.data?.[0]?.total_value?.breakdowns?.[0]?.results) return [];
    const rawResults = apiData.data[0].total_value.breakdowns[0].results;
    const processedMap: any = {};

    rawResults.forEach((item: any) => {
      const age = item.dimension_values[0];
      const gender = item.dimension_values[1];
      const value = item.value;

      if (!processedMap[age]) processedMap[age] = { name: age, Kadın: 0, Erkek: 0, Belirsiz: 0 };
      
      if (gender === 'F') processedMap[age].Kadın = value;
      else if (gender === 'M') processedMap[age].Erkek = value;
      else processedMap[age].Belirsiz = value;
    });

    return Object.values(processedMap).sort((a: any, b: any) => a.name.localeCompare(b.name));
  };

  // --- GÜNCELLENMİŞ VE DÜZELTİLMİŞ FONKSİYON ---
  const getInsightValue = (metricName: string) => {
    if (!data || !data.data) return 0;
    
    const metric = data.data.find((m: any) => m.name === metricName);
    if (!metric) return 0;

    // DURUM 1: 'total_value' yapısı (interactions ve profile_views için)
    // Senin gönderdiğin JSON yapısı buraya düşer.
    if (metric.total_value && typeof metric.total_value.value === 'number') {
      return metric.total_value.value;
    }

    // DURUM 2: 'values' dizisi yapısı (reach için)
    if (metric.values && metric.values.length > 0) {
      return metric.values.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);
    }
    
    return 0;
  };

  const fetchData = async () => {
    if (!accessToken) {
      alert("Lütfen Access Token yapıştır!");
      return;
    }
    setLoading(true);
    setError("");
    setData(null);

    try {
      const selected = QUERY_OPTIONS.find(q => q.id === selectedQuery);
      if (!selected) return;

      let url = `https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ID}`;
      
      if (selected.endpointSuffix) url += selected.endpointSuffix;
      if (selected.fields) url += `?fields=${selected.fields}`;
      else url += `?`;

      if (selected.params) url += selected.params;

      url += `&access_token=${accessToken}`;
      
      const response = await axios.get(url);
      setData(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error?.message || "Veri çekilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-blue-900 flex items-center justify-center gap-3">
            🧪 ReklaGram API Laboratuvarı
          </h1>
          <p className="text-gray-500 mt-2">Canlı Veri Görselleştirme Paneli</p>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm text-blue-600"
              placeholder="Erişim Anahtarını (Token) Buraya Yapıştır..."
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Yükleniyor..." : "Verileri Getir 🚀"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {QUERY_OPTIONS.map((option) => (
              <div 
                key={option.id}
                onClick={() => setSelectedQuery(option.id)}
                className={`cursor-pointer p-3 rounded-xl border-2 transition-all text-center flex flex-col items-center gap-2
                  ${selectedQuery === option.id 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600'
                  }`}
              >
                {option.icon}
                <span className="text-xs font-bold">{option.label}</span>
              </div>
            ))}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              🚨 <strong>Hata:</strong> {error}
            </div>
          )}
        </div>

        {data && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* 1. PROFİL KARTI */}
            {selectedQuery === 'basic' && (
               <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
               <img src={data.profile_picture_url} alt="PP" className="w-32 h-32 rounded-full border-4 border-pink-500 p-1 shadow-md" />
               <div>
                 <h2 className="text-3xl font-bold text-slate-900">{data.name}</h2>
                 <p className="text-blue-600 font-medium text-lg">@{data.username}</p>
                 <p className="text-slate-600 mt-3 max-w-xl">{data.biography}</p>
                 <div className="flex gap-8 mt-6 justify-center md:justify-start">
                   <div className="text-center">
                     <div className="text-2xl font-black text-slate-800">{data.followers_count}</div>
                     <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Takipçi</div>
                   </div>
                   <div className="text-center">
                     <div className="text-2xl font-black text-slate-800">{data.media_count}</div>
                     <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Gönderi</div>
                   </div>
                 </div>
               </div>
             </div>
            )}

            {/* 2. MEDYA GALERİSİ */}
            {selectedQuery === 'media' && data.data && (
              <>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="text-pink-600"/> Son Paylaşımlar
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.data.map((post: any) => (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      <div className="aspect-[4/5] bg-slate-100 relative">
                        <img 
                          src={post.thumbnail_url || post.media_url} 
                          className="w-full h-full object-cover" 
                          alt="Post" 
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                           <div className="flex items-center gap-2 text-lg font-bold">
                             <Heart className="w-5 h-5 fill-white" /> {post.like_count}
                           </div>
                           <div className="flex items-center gap-2 text-lg font-bold">
                             <MessageCircle className="w-5 h-5 fill-white" /> {post.comments_count}
                           </div>
                           <a href={post.permalink} target="_blank" className="mt-2 text-xs border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition">
                             Instagram'da Gör
                           </a>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                          {post.media_product_type === 'REELS' ? <Play className="w-3 h-3 inline mr-1"/> : null}
                          {post.media_product_type}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-slate-500 line-clamp-2 h-8 leading-4">{post.caption || "Açıklama yok"}</p>
                        <p className="text-[10px] text-slate-400 mt-2 text-right">{new Date(post.timestamp).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 3. DEMOGRAFİ GRAFİĞİ */}
            {selectedQuery === 'demographics' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="text-blue-600"/> Kitle Analizi
                </h2>
                <div className="h-80 w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processDemographicsData(data)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend />
                      <Bar dataKey="Kadın" fill="#ec4899" radius={[4, 4, 0, 0]} stackId="a" />
                      <Bar dataKey="Erkek" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
                      <Bar dataKey="Belirsiz" fill="#94a3b8" radius={[4, 4, 0, 0]} stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* 4. GÜNLÜK ERİŞİM (REACH) KARTI */}
            {selectedQuery === 'reach_daily' && (
               <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center max-w-sm mx-auto">
                 <div className="inline-flex p-4 rounded-full bg-green-100 text-green-600 mb-4">
                    <TrendingUp className="w-8 h-8" />
                 </div>
                 <h2 className="text-lg font-semibold text-slate-500">Günlük Erişim (Reach)</h2>
                 <div className="text-4xl font-black text-slate-800 mt-2">
                    {getInsightValue('reach').toLocaleString()} <span className="text-sm font-normal text-slate-400">kişi</span>
                 </div>
                 <p className="text-xs text-slate-400 mt-4">Son 24 saatte içeriğinizi gören tekil hesap sayısı.</p>
               </div>
            )}

            {/* 5. ETKİLEŞİM KARTLARI */}
            {selectedQuery === 'interactions_total' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100 flex items-center gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Toplam Etkileşim</p>
                    <p className="text-2xl font-bold text-slate-800">{getInsightValue('total_interactions')}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100 flex items-center gap-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Profil Ziyareti</p>
                    <p className="text-2xl font-bold text-slate-800">{getInsightValue('profile_views')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* HAM JSON ÇIKTISI */}
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-inner mt-10">
              <div className="bg-slate-800 px-4 py-2 flex justify-between items-center">
                <span className="text-xs text-green-400 font-mono">Raw API Response (Geliştirici Görünümü)</span>
                <span className="text-xs text-slate-400">status: 200 OK</span>
              </div>
              <div className="p-4 overflow-auto max-h-60">
                <pre className="text-xs font-mono text-green-300 whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}