import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🛠️ KRİTİK AYAR: Bu paketleri sunucu tarafında bırak, paketlemeye çalışma.
  serverExternalPackages: ["puppeteer", "@aws-sdk/client-s3"],

  // Diğer ayarların (Örn: Resimler)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;