import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  // 🛠️ KRİTİK AYAR: Bu paketleri sunucu tarafında bırak, paketlemeye çalışma.
  serverExternalPackages: ["puppeteer", "@aws-sdk/client-s3"],

  // Diğer ayarların (Örn: Resimler)
=======
  // 👇 BU SATIRI EKLEDİK: Next.js 16'nın çenesini kapatmak için boş ayar.
  turbopack: {}, 

  // Docker'ın dosyaları görmesi için bu Webpack ayarı ŞART:
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  
  // Resim ayarları
>>>>>>> 6748354 (feat: Cüzdan sistemi ve temizlik çalışmaları yeni branch'e taşındı)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
<<<<<<< HEAD
=======
    unoptimized: true,
>>>>>>> 6748354 (feat: Cüzdan sistemi ve temizlik çalışmaları yeni branch'e taşındı)
  },
};

export default nextConfig;