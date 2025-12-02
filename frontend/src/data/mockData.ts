// frontend/src/data/mockData.ts

export interface MockInfluencer {
  id: number;
  platform: 'instagram' | 'youtube' | 'tiktok';
  username: string;
  fullName: string;
  category: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
  engagementRate: number;
  trend: 'up' | 'down';
}

export const MOCK_DATA: MockInfluencer[] = [
  // --- INSTAGRAM (10 Kişi) ---
  { id: 1, platform: 'instagram', username: '@gezgincisena', fullName: 'Sena Ateş', category: 'Seyahat', likes: 12450, comments: 482, views: 45200, shares: 1205, engagementRate: 4.8, trend: 'up' },
  { id: 2, platform: 'instagram', username: '@gurme_emre', fullName: 'Emre Lezzet', category: 'Yemek', likes: 8340, comments: 120, views: 22100, shares: 3450, engagementRate: 3.2, trend: 'down' },
  { id: 3, platform: 'instagram', username: '@fit_caner', fullName: 'Caner Demir', category: 'Spor', likes: 25100, comments: 950, views: 80500, shares: 5600, engagementRate: 5.1, trend: 'up' },
  { id: 4, platform: 'instagram', username: '@modablog_zeynep', fullName: 'Zeynep Koç', category: 'Moda', likes: 4200, comments: 85, views: 12000, shares: 940, engagementRate: 2.4, trend: 'down' },
  { id: 5, platform: 'instagram', username: '@sanat_atolyesi', fullName: 'Ayşe Yılmaz', category: 'Sanat', likes: 15600, comments: 340, views: 35000, shares: 800, engagementRate: 3.9, trend: 'up' },
  { id: 6, platform: 'instagram', username: '@teknoloji_rehberi', fullName: 'Mehmet Tekin', category: 'Teknoloji', likes: 9800, comments: 210, views: 18000, shares: 450, engagementRate: 2.8, trend: 'down' },
  { id: 7, platform: 'instagram', username: '@doga_yuruyusu', fullName: 'Ali Dağlı', category: 'Doğa', likes: 32000, comments: 1200, views: 90000, shares: 4000, engagementRate: 6.5, trend: 'up' },
  { id: 8, platform: 'instagram', username: '@kitap_kurdu_elif', fullName: 'Elif Okur', category: 'Edebiyat', likes: 5400, comments: 600, views: 10500, shares: 300, engagementRate: 5.5, trend: 'up' },
  { id: 9, platform: 'instagram', username: '@makeup_selin', fullName: 'Selin Güzellik', category: 'Makyaj', likes: 45000, comments: 890, views: 120000, shares: 2500, engagementRate: 4.1, trend: 'down' },
  { id: 10, platform: 'instagram', username: '@kopek_egitimi', fullName: 'Barış Pati', category: 'Hayvanlar', likes: 21000, comments: 450, views: 67000, shares: 3200, engagementRate: 4.9, trend: 'up' },

  // --- YOUTUBE (10 Kişi) ---
  { id: 11, platform: 'youtube', username: '@teknomert', fullName: 'Mert Yılmaz', category: 'Teknoloji', likes: 12500, comments: 2300, views: 150200, shares: 850, engagementRate: 6.5, trend: 'up' },
  { id: 12, platform: 'youtube', username: '@makyajgunlugu', fullName: 'Elif Sönmez', category: 'Güzellik', likes: 4200, comments: 650, views: 65400, shares: 120, engagementRate: 3.1, trend: 'down' },
  { id: 13, platform: 'youtube', username: '@oyunzamani', fullName: 'Burak Gaming', category: 'Oyun', likes: 45000, comments: 12500, views: 320000, shares: 3200, engagementRate: 8.4, trend: 'up' },
  { id: 14, platform: 'youtube', username: '@bilim_kutusu', fullName: 'Cem Bilim', category: 'Eğitim', likes: 89000, comments: 4500, views: 560000, shares: 12000, engagementRate: 9.2, trend: 'up' },
  { id: 15, platform: 'youtube', username: '@film_elestirisi', fullName: 'Deniz Sinema', category: 'Eğlence', likes: 5600, comments: 890, views: 45000, shares: 230, engagementRate: 3.5, trend: 'down' },
  { id: 16, platform: 'youtube', username: '@yazilim_dersleri', fullName: 'Ahmet Kod', category: 'Eğitim', likes: 12000, comments: 900, views: 89000, shares: 1500, engagementRate: 5.8, trend: 'up' },
  { id: 17, platform: 'youtube', username: '@arabam_com', fullName: 'Volkan Oto', category: 'Otomobil', likes: 34000, comments: 1200, views: 210000, shares: 4500, engagementRate: 4.5, trend: 'up' },
  { id: 18, platform: 'youtube', username: '@yoga_pratik', fullName: 'Zeynep Yoga', category: 'Sağlık', likes: 7800, comments: 340, views: 32000, shares: 890, engagementRate: 4.1, trend: 'down' },
  { id: 19, platform: 'youtube', username: '@tarih_tozlu', fullName: 'İlber Hoca Fan', category: 'Tarih', likes: 56000, comments: 2300, views: 450000, shares: 9800, engagementRate: 7.2, trend: 'up' },
  { id: 20, platform: 'youtube', username: '@gitar_dersi', fullName: 'Rockçı Efe', category: 'Müzik', likes: 4500, comments: 210, views: 18000, shares: 120, engagementRate: 3.8, trend: 'down' },

  // --- TIKTOK (10 Kişi) ---
  { id: 21, platform: 'tiktok', username: '@komik_kedi', fullName: 'Derya Deniz', category: 'Eğlence', likes: 150000, comments: 5400, views: 1200000, shares: 12500, engagementRate: 12.5, trend: 'up' },
  { id: 22, platform: 'tiktok', username: '@dansci_ali', fullName: 'Ali Vural', category: 'Dans', likes: 8500, comments: 230, views: 45000, shares: 150, engagementRate: 4.2, trend: 'down' },
  { id: 23, platform: 'tiktok', username: '@pratikbilgiler', fullName: 'Selin Y.', category: 'Eğitim', likes: 76000, comments: 1200, views: 890000, shares: 8900, engagementRate: 9.1, trend: 'up' },
  { id: 24, platform: 'tiktok', username: '@meydan_okuma', fullName: 'Crazy Boy', category: 'Eğlence', likes: 450000, comments: 15000, views: 2500000, shares: 45000, engagementRate: 15.2, trend: 'up' },
  { id: 25, platform: 'tiktok', username: '@moda_ikonu', fullName: 'Fashion Ece', category: 'Moda', likes: 23000, comments: 450, views: 120000, shares: 1200, engagementRate: 5.6, trend: 'down' },
  { id: 26, platform: 'tiktok', username: '@sokak_lezzetleri', fullName: 'Tadı Damakta', category: 'Yemek', likes: 89000, comments: 2100, views: 560000, shares: 6700, engagementRate: 8.9, trend: 'up' },
  { id: 27, platform: 'tiktok', username: '@dublaj_kral', fullName: 'Ses Ustası', category: 'Komedi', likes: 12000, comments: 150, views: 67000, shares: 450, engagementRate: 3.4, trend: 'down' },
  { id: 28, platform: 'tiktok', username: '@spor_motivasyon', fullName: 'Fit Life', category: 'Spor', likes: 56000, comments: 890, views: 340000, shares: 4500, engagementRate: 7.1, trend: 'up' },
  { id: 29, platform: 'tiktok', username: '@resim_sanati', fullName: 'Çizgisel', category: 'Sanat', likes: 34000, comments: 560, views: 150000, shares: 2300, engagementRate: 6.2, trend: 'up' },
  { id: 30, platform: 'tiktok', username: '@sarkici_kiz', fullName: 'Melodi', category: 'Müzik', likes: 9800, comments: 340, views: 45000, shares: 560, engagementRate: 4.5, trend: 'down' },
];

export function fluctuateData(data: MockInfluencer[]): MockInfluencer[] {
  return data.map(inf => {
    const change = Math.floor(Math.random() * 20) - 5;
    return {
      ...inf,
      views: inf.views + (Math.floor(Math.random() * 100) - 20),
      likes: inf.likes + change,
      trend: Math.random() > 0.9 ? (inf.trend === 'up' ? 'down' : 'up') : inf.trend
    };
  });
}