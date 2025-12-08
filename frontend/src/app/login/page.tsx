'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import api from '@/lib/api';
import type { LoginResponse, User } from '@/types/auth';

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

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('E-posta ve şifre zorunludur');
      return;
    }

    setLoading(true);

    try {
      // Backend OAuth2 format - username field'ı kullanıyor
      const loginData = new FormData();
      loginData.append('username', formData.email);
      loginData.append('password', formData.password);

      // Login isteği
      const response = await api.post<LoginResponse>('/auth/login', loginData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { access_token, token_type } = response.data;

      // Token'ı localStorage'a kaydet
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('token_type', token_type);

      // Kullanıcı bilgilerini al (token ile)
      const userResponse = await api.get<User>('/auth/me');
      const user = userResponse.data;

      // Role'ü kaydet
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_email', user.email);

      // Role'e göre yönlendir
      switch (user.role) {
        case 'influencer':
          router.push('/influencer/home');
          break;
        case 'brand':
          router.push('/brand/home');
          break;
        case 'superadmin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('E-posta veya şifre hatalı');
      } else {
        setError(err.response?.data?.detail || 'Giriş başarısız oldu. Lütfen tekrar deneyin.');
      }
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

      {/* Back to Home Button */}
      <div className="fixed top-8 left-8 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full border border-gray-200/50 dark:border-slate-700/50 text-[#1A2A6C] dark:text-white font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all shadow-xl font-inter cursor-pointer"
        >
          <span>←</span>
          <span>Ana Sayfa</span>
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
              Tekrar Hoş Geldiniz
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-inter">
              Hesabınıza giriş yapın ve devam edin
            </p>
          </motion.div>

          {/* Login Card */}
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
                {/* Email Input */}
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
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </motion.div>

                {/* Password Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                    Şifre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>

                {/* Remember & Forgot */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-slate-600 rounded transition-all"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 font-inter">
                      Beni hatırla
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors font-inter">
                      Şifremi unuttum
                    </Link>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
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
                        <span>Giriş yapılıyor...</span>
                      </>
                    ) : (
                      <>
                        <span>Giriş Yap</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="relative my-8"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 dark:bg-slate-800/80 text-gray-500 dark:text-gray-400 font-inter backdrop-blur-sm">
                    veya
                  </span>
                </div>
              </motion.div>

              {/* Register Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-center"
              >
                <p className="text-gray-600 dark:text-gray-300 font-inter text-base">
                  Hesabınız yok mu?{' '}
                  <Link href="/register" className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline decoration-2 underline-offset-2">
                    Hemen Kaydolun
                  </Link>
                </p>
              </motion.div>

            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-inter"
          >
            Giriş yaparak{' '}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Kullanım Koşulları
            </a>{' '}
            ve{' '}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Gizlilik Politikası
            </a>
            'nı kabul etmiş olursunuz.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
