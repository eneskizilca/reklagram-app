'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Shield, Zap, LineChart, ArrowRight, Sparkles } from 'lucide-react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

export default function LandingPage() {
  return (
    <div className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-[#F8F9FD] dark:bg-slate-900 transition-colors duration-300`}>
      {/* Glassmorphic Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-gray-200/50 dark:border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 cursor-pointer">
              <div className="relative w-10 h-10">
                <Image
                  src="/reklagram-logo.png"
                  alt="ReklaGram Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1A2A6C] dark:text-white font-jakarta">
                ReklaGram
              </span>
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/login" className="cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 text-sm font-semibold text-[#1A2A6C] dark:text-white hover:text-opacity-80 border border-gray-300 dark:border-slate-600 rounded-full hover:border-gray-400 dark:hover:border-slate-500 transition-all font-inter cursor-pointer"
                >
                  Giriş Yap
                </motion.button>
              </Link>
              <Link href="/register" className="cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 text-sm font-semibold text-white bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 dark:shadow-indigo-500/50 dark:hover:shadow-indigo-500/60 transition-all font-inter cursor-pointer"
                >
                  Hemen Başla
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Gradient Orbs */}
        <div className="absolute top-20 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/30 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-indigo-200 dark:border-indigo-500/30 rounded-full px-4 py-2 mb-8 shadow-lg shadow-indigo-500/10"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 font-inter">
                Instagram & YouTube & TikTok API Entegrasyonu
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1A2A6C] dark:text-white mb-6 leading-tight font-jakarta"
            >
              Influencer Pazarlamasında
              <br />
              Tahminleri Bırakın!
              <br />
              <span className="bg-linear-to-r from-[#4F46E5] via-[#7C3AED] to-[#F97316] dark:from-[#818CF8] dark:via-[#A78BFA] dark:to-[#FB923C] bg-clip-text text-transparent">
                Veriye Güvenin
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto font-inter"
            >
              Markalar için nokta atışı demografik hedefleme, Influencer'lar için otomatik ve canlı Media Kit.{' '}
              <span className="font-semibold text-[#1A2A6C] dark:text-white">Gerçek etkiyi keşfedin.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register?role=influencer" className="cursor-pointer">
                <motion.button
                  initial={{ rotate: 0 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: [0, -1, 1, -1, 0],
                    transition: { 
                      scale: { duration: 0.2 },
                      rotate: { 
                        repeat: Infinity, 
                        duration: 0.6,
                        ease: "easeInOut"
                      }
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white font-bold rounded-full shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 dark:shadow-indigo-500/50 dark:hover:shadow-purple-500/60 transition-shadow flex items-center space-x-2 w-full sm:w-auto font-jakarta cursor-pointer"
                >
                  <span>Influencer Olarak Katıl</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>
              <Link href="/register?role=brand" className="cursor-pointer">
                <motion.button
                  initial={{ rotate: 0 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: [0, 1, -1, 1, 0],
                    transition: { 
                      scale: { duration: 0.2 },
                      rotate: { 
                        repeat: Infinity, 
                        duration: 0.6,
                        ease: "easeInOut"
                      }
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-white dark:bg-slate-800 text-[#1A2A6C] dark:text-white font-bold rounded-full shadow-xl shadow-gray-300/50 dark:shadow-slate-700/50 hover:shadow-2xl border border-gray-200 dark:border-slate-700 transition-shadow flex items-center space-x-2 w-full sm:w-auto font-jakarta cursor-pointer"
                >
                  <span>Marka Olarak Keşfet</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual/Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 relative max-w-6xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 dark:shadow-indigo-500/40 border border-gray-200/50 dark:border-slate-700/50 bg-linear-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 p-8 backdrop-blur-sm">
              {/* Mockup Grid - Abstract Dashboard */}
              <div className="grid grid-cols-12 gap-4 h-96">
                {/* Sidebar */}
                <div className="col-span-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 space-y-3 shadow-lg shadow-indigo-500/5">
                  <div className="h-8 bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-xl"></div>
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-xl w-3/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-xl w-2/3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-xl w-3/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-xl w-1/2"></div>
                </div>
                {/* Main Content */}
                <div className="col-span-9 space-y-4">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 h-32 flex items-center justify-between shadow-lg shadow-indigo-500/5">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                      <div className="h-8 bg-linear-to-r from-indigo-300 via-purple-300 to-orange-300 dark:from-indigo-500 dark:via-purple-500 dark:to-orange-500 rounded w-1/2"></div>
                    </div>
                    <div className="w-24 h-24 bg-linear-to-br from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-full opacity-20 dark:opacity-30"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 h-24 space-y-2 shadow-lg shadow-blue-500/5">
                      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
                      <div className="h-6 bg-blue-200 dark:bg-blue-700 rounded w-1/2"></div>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 h-24 space-y-2 shadow-lg shadow-purple-500/5">
                      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
                      <div className="h-6 bg-purple-200 dark:bg-purple-700 rounded w-1/2"></div>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 h-24 space-y-2 shadow-lg shadow-orange-500/5">
                      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
                      <div className="h-6 bg-orange-200 dark:bg-orange-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 h-32 shadow-lg shadow-indigo-500/5">
                    <div className="h-full bg-linear-to-r from-blue-100 via-purple-100 to-orange-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-orange-900/30 rounded-xl"></div>
                  </div>
                </div>
              </div>
              {/* Glow Effects */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-500/40 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/40 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1A2A6C] dark:text-white mb-4 tracking-tight font-jakarta">
              Neden <span className="bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] bg-clip-text text-transparent">ReklaGram</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-inter">
              Sektördeki güven sorununu, teknoloji ve veri şeffaflığı ile çözüyoruz.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Doğrulanmış Veri */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/40 transition-all border border-transparent hover:border-indigo-300/50 dark:hover:border-indigo-500/50"
            >
              <div className="w-14 h-14 bg-linear-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/10">
                <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
              <h3 className="text-2xl font-bold text-[#1A2A6C] dark:text-white mb-4 tracking-tight font-jakarta">
                Doğrulanmış Veri
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-inter">
                Instagram ve YouTube API entegrasyonu ile <span className="font-semibold text-[#1A2A6C] dark:text-white">%100 gerçek metrikler</span>. Sahte takipçilere veda edin.
              </p>
            </motion.div>

            {/* Card 2: Akıllı Media Kit */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/40 transition-all border border-transparent hover:border-purple-300/50 dark:hover:border-purple-500/50"
            >
              <div className="w-14 h-14 bg-linear-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/10">
                <Zap className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
              <h3 className="text-2xl font-bold text-[#1A2A6C] dark:text-white mb-4 tracking-tight font-jakarta">
                Akıllı Media Kit
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-inter">
                Saniyeler içinde güncellenen, <span className="font-semibold text-[#1A2A6C] dark:text-white">paylaşılabilir profesyonel portfolyo</span>. Markalara etkileşim gücünüzü kanıtlayın.
              </p>
            </motion.div>

            {/* Card 3: Güvenli İşbirliği */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 shadow-lg shadow-orange-500/10 dark:shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/20 dark:hover:shadow-orange-500/40 transition-all border border-transparent hover:border-orange-300/50 dark:hover:border-orange-500/50"
            >
              <div className="w-14 h-14 bg-linear-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/10">
                <LineChart className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
              <h3 className="text-2xl font-bold text-[#1A2A6C] dark:text-white mb-4 tracking-tight font-jakarta">
                Güvenli İşbirliği
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-inter">
                Şeffaf süreçler ve güvenli anlaşmalarla <span className="font-semibold text-[#1A2A6C] dark:text-white">riskleri sıfırlayın</span>. Demografik veri ile hedefli çalışmalar.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F9FD] dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-linear-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] rounded-3xl p-12 text-center shadow-2xl shadow-indigo-500/30 dark:shadow-indigo-500/50 relative overflow-hidden"
        >
          {/* Glow Effects */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight font-jakarta">
              Veriye Dayalı İşbirliğine Hazır Mısınız?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto font-inter">
              ReklaGram ile influencer pazarlamasında yeni standardı yaratın. Bugün başlayın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white text-[#1A2A6C] font-bold rounded-full shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto font-jakarta cursor-pointer"
                >
                  Ücretsiz Hesap Oluştur
                </motion.button>
            </Link>
              <Link href="/login" className="cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all w-full sm:w-auto font-jakarta cursor-pointer"
                >
                  Zaten Hesabım Var
                </motion.button>
            </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-10 h-10">
                  <Image
                    src="/reklagram-logo.png"
                    alt="ReklaGram Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-[#1A2A6C] dark:text-white font-jakarta">ReklaGram</span>
              </div>
              <p className="text-sm max-w-md font-inter">
                Influencer pazarlamasında güven ve veri şeffaflığını sağlayan, B2B ve B2C hibrit SaaS platformu.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[#1A2A6C] dark:text-white font-semibold mb-4 font-jakarta">Platform</h4>
              <ul className="space-y-2 text-sm font-inter">
                <li><Link href="/register" className="hover:text-[#1A2A6C] dark:hover:text-white transition-colors cursor-pointer">Kayıt Ol</Link></li>
                <li><Link href="/login" className="hover:text-[#1A2A6C] dark:hover:text-white transition-colors cursor-pointer">Giriş Yap</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-[#1A2A6C] dark:text-white font-semibold mb-4 font-jakarta">Sosyal Medya</h4>
              <ul className="space-y-2 text-sm font-inter">
                <li><a href="#" className="hover:text-[#1A2A6C] dark:hover:text-white transition-colors cursor-pointer">Instagram</a></li>
                <li><a href="#" className="hover:text-[#1A2A6C] dark:hover:text-white transition-colors cursor-pointer">LinkedIn</a></li>
                <li><a href="#" className="hover:text-[#1A2A6C] dark:hover:text-white transition-colors cursor-pointer">Twitter</a></li>
              </ul>
        </div>
      </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 dark:border-slate-800 pt-8 text-center text-sm font-inter">
            <p>© 2026 ReklaGram. Tüm hakları saklıdır. Veriye Dayalı İşbirliği.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
