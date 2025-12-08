'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import api from '@/lib/api';

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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('E-posta adresi zorunludur');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-[#F8F9FD] dark:bg-slate-900 relative overflow-hidden`}>
      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/10 dark:bg-orange-500/20 rounded-full blur-3xl"></div>

      {/* Back to Login Button */}
      <div className="fixed top-8 left-8 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/login')}
          className="flex items-center space-x-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full border border-gray-200/50 dark:border-slate-700/50 text-[#1A2A6C] dark:text-white font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all shadow-xl font-inter cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Giriş Sayfası</span>
        </motion.div>
      </div>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-md w-full"
        >
          {/* Logo & Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="/reklagram-logo.png"
                  alt="ReklaGram Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#1A2A6C] dark:text-white font-jakarta">
                ReklaGram
              </span>
            </Link>

            <h2 className="text-3xl font-extrabold text-[#1A2A6C] dark:text-white mb-2 font-jakarta">
              Şifremi Unuttum
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-inter">
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/20 border border-gray-200/50 dark:border-slate-700/50 p-8 relative overflow-hidden"
          >
            {/* Decorative Elements Inside Card */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400/10 dark:bg-purple-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-400/10 dark:bg-indigo-500/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2A6C] dark:text-white mb-2 font-jakarta">
                    E-posta Gönderildi!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 font-inter">
                    <span className="font-semibold">{email}</span> adresine şifre sıfırlama bağlantısı gönderdik. 
                    Lütfen e-postanızı kontrol edin.
                  </p>
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] text-white font-bold rounded-xl hover:shadow-xl transition-all font-jakarta"
                    >
                      <span>Giriş Sayfasına Dön</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </motion.div>
              ) : (
                <>
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">⚠️</span>
                        <span className="font-inter">{error}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                        E-posta Adresi
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="group w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-[#1A2A6C] via-[#7C3AED] to-[#F97316] hover:shadow-xl hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-jakarta relative overflow-hidden"
                      >
                        {/* Animated Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Gönderiliyor...</span>
                          </>
                        ) : (
                          <>
                            <span>Sıfırlama Bağlantısı Gönder</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>

                  {/* Login Link */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-6 text-center"
                  >
                    <p className="text-gray-600 dark:text-gray-300 font-inter text-sm">
                      Şifrenizi hatırladınız mı?{' '}
                      <Link href="/login" className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        Giriş Yapın
                      </Link>
                    </p>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-inter"
          >
            E-posta gelmedi mi? Spam klasörünüzü kontrol edin.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
