"use client";
import { use } from "react"; // <--- BU SATIR EKLENDİ (React.use)
import { Users, BarChart3, Mail, Globe, ExternalLink } from "lucide-react";

// Tip Tanımı Güncellendi: params artık bir Promise
export default function MediaKitRenderPage({ params }: { params: Promise<{ email: string }> }) {
  
  // params bir Promise olduğu için 'use' hook'u ile içini açıyoruz
  const { email } = use(params); 

  // Artık 'email' değişkenini kullanabiliriz
  const decodedEmail = decodeURIComponent(email);

  const data = {
    name: "FÜBET FIRAT",
    email: decodedEmail,
    username: "fubet.firat",
    category: "Teknoloji & Eğitim",
    bio: "Fırat Üniversitesi Bilişim ve Teknoloji Topluluğu.",
    followers: "1,540",
    engagement: "%4.8",
    website: "fubet.org.tr",
    img: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop"
  };

  return (
    <div className="w-[210mm] h-[297mm] bg-white mx-auto overflow-hidden relative shadow-2xl print:shadow-none">
      
      {/* ÜST ŞERİT */}
      <div className="h-4 bg-gradient-to-r from-[#1A2A6C] via-[#B21F1F] to-[#FDBB2D] w-full"></div>

      <div className="p-12 h-full flex flex-col justify-between">
        
        {/* HEADER */}
        <div className="flex justify-between items-start mb-10">
          <div className="flex gap-6 items-center">
            <img 
              src={data.img} 
              className="w-32 h-32 rounded-full border-4 border-blue-900 object-cover shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-extrabold text-[#1A2A6C] uppercase tracking-tight">{data.name}</h1>
              <p className="text-xl text-gray-500 font-medium mt-1">{data.email}</p> 
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mt-3 font-bold">
                {data.category}
              </span>
            </div>
          </div>
          
          <div className="text-right">
             <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1A2A6C] to-[#B21F1F]">
               ReklaGram
             </h2>
             <p className="text-xs text-gray-400 mt-1">Onaylı Media Kit</p>
          </div>
        </div>

        {/* ORTA ALAN (BİYO & İSTATİSTİKLER) */}
        <div className="grid grid-cols-3 gap-8 mb-12">
           <div className="col-span-2">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">Hakkında</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {data.bio}
                <br/><br/>
                Teknoloji dünyasındaki en son gelişmeleri takipçilerimizle paylaşıyor, eğitim içerikleriyle genç yazılımcılara ilham oluyoruz.
              </p>
           </div>
           <div className="col-span-1 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                 <Users className="w-6 h-6 mx-auto text-blue-600 mb-1"/>
                 <div className="text-2xl font-black text-slate-800">{data.followers}</div>
                 <div className="text-xs text-slate-500 uppercase">Takipçi</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                 <BarChart3 className="w-6 h-6 mx-auto text-green-600 mb-1"/>
                 <div className="text-2xl font-black text-slate-800">{data.engagement}</div>
                 <div className="text-xs text-slate-500 uppercase">Etkileşim</div>
              </div>
           </div>
        </div>

        {/* DEMOGRAFİ ALANI (GRAFİKLER GELECEK) */}
        <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-8 relative">
           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
             <Users className="w-5 h-5"/> Kitle Analizi
           </h3>
           <div className="flex items-center justify-center h-48 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-lg">
              (Buraya Recharts Grafikleri Gelecek)
           </div>
           
           <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                 <h4 className="text-sm font-bold text-gray-700 mb-2">Yaş Dağılımı</h4>
                 <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                 </div>
                 <div className="flex justify-between text-xs text-gray-500">
                    <span>18-24</span>
                    <span className="font-bold">%65</span>
                 </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                 <h4 className="text-sm font-bold text-gray-700 mb-2">Cinsiyet</h4>
                 <div className="flex gap-2">
                    <div className="flex-1 bg-pink-100 text-pink-700 text-center py-1 rounded text-xs font-bold">%30 Kadın</div>
                    <div className="flex-1 bg-blue-100 text-blue-700 text-center py-1 rounded text-xs font-bold">%70 Erkek</div>
                 </div>
              </div>
           </div>
        </div>

        {/* FOOTER */}
        <div className="border-t pt-6 flex justify-between items-center text-sm">
           <div className="flex gap-6">
              <div className="flex items-center gap-2 text-gray-600 font-bold bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                 <Mail className="w-4 h-4 text-orange-600"/> {data.email}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                 <Globe className="w-4 h-4"/> {data.website}
              </div>
           </div>
           <div className="flex items-center gap-2 text-[#1A2A6C] font-bold">
              <ExternalLink className="w-4 h-4"/> Profili Görüntüle
           </div>
        </div>

      </div>
      <div className="h-2 bg-slate-900 w-full absolute bottom-0"></div>
    </div>
  );
}