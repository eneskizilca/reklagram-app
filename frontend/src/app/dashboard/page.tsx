'use client';

import { useState, useEffect } from 'react';
// Import yolunu senin düzelttiğin gibi göreceli yol yapıyoruz:
import { MOCK_DATA, fluctuateData, MockInfluencer } from '../../data/mockData';

export default function DashboardPage() {
  const [influencers, setInfluencers] = useState<MockInfluencer[]>(MOCK_DATA);
  const [searchTerm, setSearchTerm] = useState('');

  // Canlı veri simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setInfluencers((currentData) => fluctuateData(currentData));
    }, 2500); 

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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Kanal</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Influencer</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Trend</th>
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Etkileşim %</th>
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">İzlenme</th>
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Beğeni</th>
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
                      <span className="mt-1 inline-flex w-fit items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                        {inf.category}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {inf.trend === 'up' ? (
                      <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Yükselişte
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-bold">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                        Düşüşte
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-2 w-16 rounded-full bg-gray-200">
                        <div 
                          className={`h-2 rounded-full ${inf.engagementRate > 5 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                          style={{ width: `${Math.min(inf.engagementRate * 10, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-700">%{inf.engagementRate}</span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-sm font-medium text-gray-900">
                    {inf.views.toLocaleString('tr-TR')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-sm text-gray-600">
                    {inf.likes.toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))
            ) : (
              // Arama sonucu boşsa - İŞTE DÜZELTİLEN KISIM BURASI
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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