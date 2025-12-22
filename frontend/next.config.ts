import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // 👇 BU SATIRI EKLEDİK: Next.js 16'nın çenesini kapatmak için boş ayar.
  serverExternalPackages: ["puppeteer", "@aws-sdk/client-s3"],
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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],

    unoptimized: true,

  },
};

export default nextConfig;