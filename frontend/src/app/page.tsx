import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
      {/* Hero Section */}
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full text-center">
          {/* Logo/Title */}
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              ReklaGram
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-medium">
              Influencer'lar ve Markalar İçin Akıllı Platform
            </p>
          </div>

          {/* Description */}
          <div className="mb-12 max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed">
              Güven ve şeffaflık ile influencer pazarlamasını yeniden tanımlıyoruz.
              Doğrulanmış verilerle, gerçek kitleleri keşfedin ve başarılı işbirlikleri kurun.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                İçerik Üreticileri
              </h3>
              <p className="text-gray-600 text-sm">
                Gerçek kitle gücünüzü kanıtlayın, profesyonel Media Kit oluşturun
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Markalar
              </h3>
              <p className="text-gray-600 text-sm">
                Doğrulanmış verilerle, hedef kitlenize ulaşan influencer'ları keşfedin
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Anlık Analitik
              </h3>
              <p className="text-gray-600 text-sm">
                Instagram, YouTube, TikTok entegrasyonu ile gerçek zamanlı veriler
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              🚀 Hemen Başla
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              🔑 Giriş Yap
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-purple-600">1000+</div>
              <div className="text-sm text-gray-600">Influencer</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600">Marka</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">5000+</div>
              <div className="text-sm text-gray-600">İşbirliği</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            © 2024 ReklaGram. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
