'use client';

import { useState, useEffect } from 'react';
import { MOCK_DATA, fluctuateData, MockInfluencer } from '../../data/mockData';

export default function DashboardPage() {
  const [influencers, setInfluencers] = useState<MockInfluencer[]>(MOCK_DATA);
  const [searchTerm, setSearchTerm] = useState('');

  // Canlı veri simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setInfluencers((currentData) => fluctuateData(currentData));
    }, 2500); // 2.5 saniyede bir güncelle

    return () => clearInterval(interval);
  }, []);

  // Filtreleme
  const filteredInfluencers = influencers.filter((inf) =>
    inf.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* Başlık */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ReklaGram Panel</h1>
          <p className="text-gray-500">
            Toplam <span className="font-bold text-blue-600">{influencers.length}</span> Influencer izleniyor
          </p>
        </div>
        
        <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700 shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </span>
          <span className="text-sm font-semibold">Canlı Veri Akışı</span>
        </div>
      </div>

      {/* Arama Kutusu */}
      <div className="mb-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-white p-4 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Influencer adı, kullanıcı adı veya kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Influencer</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Kategori</th>
              
              {/* YENİ SÜTUNLAR */}
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-900 bg-blue-50/50">Canlı Takipçi</th>
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Story (24s)</th>
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Reels Etk.</th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Yaş Kitlesi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredInfluencers.length > 0 ? (
              filteredInfluencers.map((inf) => (
                <tr key={inf.id} className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-bold ring-1 ring-inset ${
                      inf.platform === 'instagram' ? 'bg-gradient-to-tr from-yellow-100 to-purple-100 text-purple-700 ring-purple-700/20' :
                      inf.platform === 'youtube' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                      'bg-gray-900 text-white ring-gray-700/20'
                    }`}>
                      {inf.platform === 'tiktok' ? 'TikTok' : inf.platform === 'youtube' ? 'YouTube' : 'Instagram'}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{inf.fullName}</span>
                      <span className="text-xs text-gray-500">{inf.username}</span>
                      {/* Trend Oku İsmin Yanına Geldi */}
                      <div className="mt-1 flex items-center gap-1">
                         {inf.trend === 'up' ? (
                            <span className="text-[10px] font-bold text-green-600 flex items-center">
                              <svg className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                              Trend
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-red-600 flex items-center">
                              <svg className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                              Düşüş
                            </span>
                          )}
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {inf.category}
                  </td>

                  {/* TAKİPÇİ (YENİ VE CANLI) */}
                  <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-sm font-bold text-blue-700 bg-blue-50/30">
                    {inf.followers.toLocaleString('tr-TR')}
                  </td>

                  {/* STORY İZLENME (YENİ) */}
                  <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-sm text-gray-700">
                    {inf.storyAvgViews.toLocaleString('tr-TR')}
                  </td>

                  {/* REELS ETKİLEŞİM (YENİ) */}
                  <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-sm text-gray-600">
                    {inf.reelsInteraction.toLocaleString('tr-TR')}
                  </td>

                  {/* YAŞ KİTLESİ (YENİ) */}
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {inf.audienceAge}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <p className="text-lg">🔍 &quot;{searchTerm}&quot; için sonuç bulunamadı.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}