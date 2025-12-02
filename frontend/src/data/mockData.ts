// frontend/src/data/mockData.ts

export interface MockInfluencer {
  id: number;
  platform: 'instagram' | 'youtube' | 'tiktok';
  username: string;
  fullName: string;
  category: string;
  likes: number;     // Son gönderi beğenisi
  views: number;     // Son gönderi izlenmesi
  
  // YENİ EKLENEN ALANLAR
  followers: number;       // Toplam Takipçi (Canlı değişecek)
  storyAvgViews: number;   // Son 24 Saat Ortalama Story
  reelsInteraction: number;// Reels Etkileşim Sayısı
  audienceAge: string;     // Hedef Yaş Kitlesi (Statik)
  
  trend: 'up' | 'down';
}

export const MOCK_DATA: MockInfluencer[] = [
  // --- INSTAGRAM (10 Kişi) ---
  { id: 1, platform: 'instagram', username: '@gezgincisena', fullName: 'Sena Ateş', category: 'Seyahat', likes: 12450, views: 45200, followers: 215400, storyAvgViews: 45000, reelsInteraction: 12500, audienceAge: '25-34', trend: 'up' },
  { id: 2, platform: 'instagram', username: '@gurme_emre', fullName: 'Emre Lezzet', category: 'Yemek', likes: 8340, views: 22100, followers: 156000, storyAvgViews: 32000, reelsInteraction: 8900, audienceAge: '18-24', trend: 'down' },
  { id: 3, platform: 'instagram', username: '@fit_caner', fullName: 'Caner Demir', category: 'Spor', likes: 25100, views: 80500, followers: 540200, storyAvgViews: 120000, reelsInteraction: 45000, audienceAge: '18-24', trend: 'up' },
  { id: 4, platform: 'instagram', username: '@modablog_zeynep', fullName: 'Zeynep Koç', category: 'Moda', likes: 4200, views: 12000, followers: 89000, storyAvgViews: 15000, reelsInteraction: 3200, audienceAge: '25-34', trend: 'down' },
  { id: 5, platform: 'instagram', username: '@sanat_atolyesi', fullName: 'Ayşe Yılmaz', category: 'Sanat', likes: 15600, views: 35000, followers: 120500, storyAvgViews: 28000, reelsInteraction: 11000, audienceAge: '35-44', trend: 'up' },
  { id: 6, platform: 'instagram', username: '@teknoloji_rehberi', fullName: 'Mehmet Tekin', category: 'Teknoloji', likes: 9800, views: 18000, followers: 95000, storyAvgViews: 12000, reelsInteraction: 5600, audienceAge: '18-24', trend: 'down' },
  { id: 7, platform: 'instagram', username: '@doga_yuruyusu', fullName: 'Ali Dağlı', category: 'Doğa', likes: 32000, views: 90000, followers: 320000, storyAvgViews: 85000, reelsInteraction: 29000, audienceAge: '25-34', trend: 'up' },
  { id: 8, platform: 'instagram', username: '@kitap_kurdu_elif', fullName: 'Elif Okur', category: 'Edebiyat', likes: 5400, views: 10500, followers: 45000, storyAvgViews: 8900, reelsInteraction: 2100, audienceAge: '18-24', trend: 'up' },
  { id: 9, platform: 'instagram', username: '@makeup_selin', fullName: 'Selin Güzellik', category: 'Makyaj', likes: 45000, views: 120000, followers: 890000, storyAvgViews: 250000, reelsInteraction: 98000, audienceAge: '18-24', trend: 'down' },
  { id: 10, platform: 'instagram', username: '@kopek_egitimi', fullName: 'Barış Pati', category: 'Hayvanlar', likes: 21000, views: 67000, followers: 180000, storyAvgViews: 56000, reelsInteraction: 19000, audienceAge: '35-44', trend: 'up' },

  // --- YOUTUBE (10 Kişi) ---
  { id: 11, platform: 'youtube', username: '@teknomert', fullName: 'Mert Yılmaz', category: 'Teknoloji', likes: 12500, views: 150200, followers: 450000, storyAvgViews: 12000, reelsInteraction: 5600, audienceAge: '18-24', trend: 'up' },
  { id: 12, platform: 'youtube', username: '@makyajgunlugu', fullName: 'Elif Sönmez', category: 'Güzellik', likes: 4200, views: 65400, followers: 120000, storyAvgViews: 4500, reelsInteraction: 1200, audienceAge: '18-24', trend: 'down' },
  { id: 13, platform: 'youtube', username: '@oyunzamani', fullName: 'Burak Gaming', category: 'Oyun', likes: 45000, views: 320000, followers: 1200000, storyAvgViews: 150000, reelsInteraction: 45000, audienceAge: '13-17', trend: 'up' },
  { id: 14, platform: 'youtube', username: '@bilim_kutusu', fullName: 'Cem Bilim', category: 'Eğitim', likes: 89000, views: 560000, followers: 2300000, storyAvgViews: 210000, reelsInteraction: 89000, audienceAge: '18-24', trend: 'up' },
  { id: 15, platform: 'youtube', username: '@film_elestirisi', fullName: 'Deniz Sinema', category: 'Eğlence', likes: 5600, views: 45000, followers: 85000, storyAvgViews: 12000, reelsInteraction: 3400, audienceAge: '25-34', trend: 'down' },
  { id: 16, platform: 'youtube', username: '@yazilim_dersleri', fullName: 'Ahmet Kod', category: 'Eğitim', likes: 12000, views: 89000, followers: 320000, storyAvgViews: 45000, reelsInteraction: 12000, audienceAge: '18-24', trend: 'up' },
  { id: 17, platform: 'youtube', username: '@arabam_com', fullName: 'Volkan Oto', category: 'Otomobil', likes: 34000, views: 210000, followers: 670000, storyAvgViews: 89000, reelsInteraction: 23000, audienceAge: '25-34', trend: 'up' },
  { id: 18, platform: 'youtube', username: '@yoga_pratik', fullName: 'Zeynep Yoga', category: 'Sağlık', likes: 7800, views: 32000, followers: 150000, storyAvgViews: 34000, reelsInteraction: 5600, audienceAge: '35-44', trend: 'down' },
  { id: 19, platform: 'youtube', username: '@tarih_tozlu', fullName: 'İlber Hoca Fan', category: 'Tarih', likes: 56000, views: 450000, followers: 890000, storyAvgViews: 120000, reelsInteraction: 45000, audienceAge: '25-34', trend: 'up' },
  { id: 20, platform: 'youtube', username: '@gitar_dersi', fullName: 'Rockçı Efe', category: 'Müzik', likes: 4500, views: 18000, followers: 56000, storyAvgViews: 8900, reelsInteraction: 2300, audienceAge: '18-24', trend: 'down' },

  // --- TIKTOK (10 Kişi) ---
  { id: 21, platform: 'tiktok', username: '@komik_kedi', fullName: 'Derya Deniz', category: 'Eğlence', likes: 150000, views: 1200000, followers: 2500000, storyAvgViews: 560000, reelsInteraction: 230000, audienceAge: '13-17', trend: 'up' },
  { id: 22, platform: 'tiktok', username: '@dansci_ali', fullName: 'Ali Vural', category: 'Dans', likes: 8500, views: 45000, followers: 120000, storyAvgViews: 34000, reelsInteraction: 12000, audienceAge: '18-24', trend: 'down' },
  { id: 23, platform: 'tiktok', username: '@pratikbilgiler', fullName: 'Selin Y.', category: 'Eğitim', likes: 76000, views: 890000, followers: 1500000, storyAvgViews: 340000, reelsInteraction: 120000, audienceAge: '18-24', trend: 'up' },
  { id: 24, platform: 'tiktok', username: '@meydan_okuma', fullName: 'Crazy Boy', category: 'Eğlence', likes: 450000, views: 2500000, followers: 5600000, storyAvgViews: 1200000, reelsInteraction: 890000, audienceAge: '13-17', trend: 'up' },
  { id: 25, platform: 'tiktok', username: '@moda_ikonu', fullName: 'Fashion Ece', category: 'Moda', likes: 23000, views: 120000, followers: 450000, storyAvgViews: 89000, reelsInteraction: 34000, audienceAge: '18-24', trend: 'down' },
  { id: 26, platform: 'tiktok', username: '@sokak_lezzetleri', fullName: 'Tadı Damakta', category: 'Yemek', likes: 89000, views: 560000, followers: 1200000, storyAvgViews: 340000, reelsInteraction: 150000, audienceAge: '25-34', trend: 'up' },
  { id: 27, platform: 'tiktok', username: '@dublaj_kral', fullName: 'Ses Ustası', category: 'Komedi', likes: 12000, views: 67000, followers: 230000, storyAvgViews: 45000, reelsInteraction: 12000, audienceAge: '18-24', trend: 'down' },
  { id: 28, platform: 'tiktok', username: '@spor_motivasyon', fullName: 'Fit Life', category: 'Spor', likes: 56000, views: 340000, followers: 890000, storyAvgViews: 150000, reelsInteraction: 67000, audienceAge: '18-24', trend: 'up' },
  { id: 29, platform: 'tiktok', username: '@resim_sanati', fullName: 'Çizgisel', category: 'Sanat', likes: 34000, views: 150000, followers: 450000, storyAvgViews: 89000, reelsInteraction: 34000, audienceAge: '25-34', trend: 'up' },
  { id: 30, platform: 'tiktok', username: '@sarkici_kiz', fullName: 'Melodi', category: 'Müzik', likes: 9800, views: 45000, followers: 120000, storyAvgViews: 34000, reelsInteraction: 12000, audienceAge: '18-24', trend: 'down' },
];

// CANLILIK FONKSİYONU: 
// Takipçi sayısını da artık titretiyoruz!
export function fluctuateData(data: MockInfluencer[]): MockInfluencer[] {
  return data.map(inf => {
    return {
      ...inf,
      // Takipçi sayısı (+5 ile -2 arası oynar) -> Çok inandırıcı durur
      followers: inf.followers + (Math.floor(Math.random() * 8) - 2),
      
      // Story ve Reels de oynasın
      storyAvgViews: inf.storyAvgViews + (Math.floor(Math.random() * 30) - 10),
      reelsInteraction: inf.reelsInteraction + (Math.floor(Math.random() * 20) - 5),
      
      // Eski metrikler
      views: inf.views + (Math.floor(Math.random() * 100) - 20),
      likes: inf.likes + (Math.floor(Math.random() * 20) - 5),
      trend: Math.random() > 0.9 ? (inf.trend === 'up' ? 'down' : 'up') : inf.trend
    };
  });
}