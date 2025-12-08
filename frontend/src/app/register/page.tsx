'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  Building2, 
  Globe,
  ArrowRight
} from 'lucide-react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import api from '@/lib/api';
import type { RoleType, RegisterInfluencerData, RegisterBrandData } from '@/types/auth';

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

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role') as RoleType | null;
  
  const [role, setRole] = useState<RoleType>(roleParam || 'influencer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    // Influencer fields
    display_name: '',
    instagram_username: '',
    youtube_channel_url: '',
    tiktok_username: '',
    category: '',
    bio: '',
    target_age_range: '',
    target_gender: '',
    location: '',
    // Brand fields
    company_name: '',
    industry: '',
    website_url: '',
    contact_person: '',
    phone_number: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('E-posta ve şifre zorunludur');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return false;
    }

    if (role === 'influencer' && !formData.display_name) {
      setError('Görünen ad zorunludur');
      return false;
    }

    if (role === 'brand' && !formData.company_name) {
      setError('Şirket adı zorunludur');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      let registerData: RegisterInfluencerData | RegisterBrandData;

      if (role === 'influencer') {
        registerData = {
          email: formData.email,
          password: formData.password,
          role: 'influencer',
          display_name: formData.display_name,
          instagram_username: formData.instagram_username || undefined,
          youtube_channel_url: formData.youtube_channel_url || undefined,
          tiktok_username: formData.tiktok_username || undefined,
          category: formData.category || undefined,
          bio: formData.bio || undefined,
          target_age_range: formData.target_age_range || undefined,
          target_gender: formData.target_gender || undefined,
          location: formData.location || undefined,
        };
      } else {
        registerData = {
          email: formData.email,
          password: formData.password,
          role: 'brand',
          company_name: formData.company_name,
          industry: formData.industry || undefined,
          website_url: formData.website_url || undefined,
          contact_person: formData.contact_person || undefined,
          phone_number: formData.phone_number || undefined,
        };
      }

      await api.post('/auth/register', registerData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Kayıt başarısız oldu. Lütfen tekrar deneyin.');
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
          className="max-w-3xl w-full"
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
              Hesap Oluşturun
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-inter">
              ReklaGram ailesine katılın ve başlayın
            </p>
          </motion.div>

          {/* Register Card */}
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
              {/* Role Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8"
              >
                <div className="flex gap-3 bg-gray-100/80 dark:bg-slate-900/50 p-2 rounded-2xl backdrop-blur-sm">
                  <motion.button
                    type="button"
                    onClick={() => setRole('influencer')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all font-jakarta ${
                      role === 'influencer'
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#F97316] text-white shadow-lg shadow-purple-500/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="mr-2">🎬</span> Influencer
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setRole('brand')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all font-jakarta ${
                      role === 'brand'
                        ? 'bg-gradient-to-r from-[#1A2A6C] to-[#4F46E5] text-white shadow-lg shadow-indigo-500/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="mr-2">🏢</span> Marka
                  </motion.button>
                </div>
              </motion.div>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-200 px-4 py-3 rounded-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">✅</span>
                      <span className="font-inter">Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">⚠️</span>
                      <span className="font-inter">{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Common Fields */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                      E-posta Adresi <span className="text-red-500">*</span>
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
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                        Şifre <span className="text-red-500">*</span>
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
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                        Şifre Tekrar <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Influencer Specific Fields */}
                <AnimatePresence mode="wait">
                  {role === 'influencer' && (
                    <motion.div
                      key="influencer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 border-t border-gray-200 dark:border-slate-700 pt-6"
                    >
                      <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                        Influencer Bilgileri
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="display_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                            Görünen Ad <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="display_name"
                              name="display_name"
                              type="text"
                              required={role === 'influencer'}
                              value={formData.display_name}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                              placeholder="İsminiz"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                            Kategori
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-inter shadow-sm"
                          >
                            <option value="">Seçiniz</option>
                            <option value="Seyahat">Seyahat</option>
                            <option value="Teknoloji">Teknoloji</option>
                            <option value="Moda">Moda</option>
                            <option value="Yemek">Yemek</option>
                            <option value="Spor">Spor</option>
                            <option value="Güzellik">Güzellik</option>
                            <option value="Oyun">Oyun</option>
                            <option value="Eğitim">Eğitim</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                            Konum
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="location"
                              name="location"
                              type="text"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                              placeholder="Şehir"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="instagram_username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                            Instagram
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <span className="text-lg">📷</span>
                            </div>
                            <input
                              id="instagram_username"
                              name="instagram_username"
                              type="text"
                              value={formData.instagram_username}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                              placeholder="@username"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="tiktok_username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                            TikTok
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <span className="text-lg">🎵</span>
                            </div>
                            <input
                              id="tiktok_username"
                              name="tiktok_username"
                              type="text"
                              value={formData.tiktok_username}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                              placeholder="@username"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="youtube_channel_url" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                            YouTube
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <span className="text-lg">📺</span>
                            </div>
                            <input
                              id="youtube_channel_url"
                              name="youtube_channel_url"
                              type="text"
                              value={formData.youtube_channel_url}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                              placeholder="@username"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Brand Specific Fields */}
                  {role === 'brand' && (
                    <motion.div
                      key="brand"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 border-t border-gray-200 dark:border-slate-700 pt-6"
                    >
                      <h3 className="text-lg font-bold text-[#1A2A6C] dark:text-white font-jakarta">
                        Marka Bilgileri
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="company_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                            Şirket Adı <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Building2 className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="company_name"
                              name="company_name"
                              type="text"
                              required={role === 'brand'}
                              value={formData.company_name}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                              placeholder="Şirket adı"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                            Sektör
                          </label>
                          <select
                            id="industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-inter shadow-sm"
                          >
                            <option value="">Seçiniz</option>
                            <option value="E-ticaret">E-ticaret</option>
                            <option value="Moda">Moda</option>
                            <option value="Teknoloji">Teknoloji</option>
                            <option value="Gıda">Gıda</option>
                            <option value="Kozmetik">Kozmetik</option>
                            <option value="Otomotiv">Otomotiv</option>
                            <option value="Finans">Finans</option>
                            <option value="Eğitim">Eğitim</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="website_url" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-jakarta">
                          Web Sitesi
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Globe className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="website_url"
                            name="website_url"
                            type="url"
                            value={formData.website_url}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 font-inter shadow-sm"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.button
                    type="submit"
                    disabled={loading || success}
                    whileHover={{ scale: loading || success ? 1 : 1.02 }}
                    whileTap={{ scale: loading || success ? 1 : 0.98 }}
                    className={`group w-full py-4 px-6 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-jakarta relative overflow-hidden ${
                      role === 'influencer'
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#F97316] hover:shadow-xl hover:shadow-purple-500/30 dark:hover:shadow-purple-500/50'
                        : 'bg-gradient-to-r from-[#1A2A6C] to-[#4F46E5] hover:shadow-xl hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50'
                    }`}
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
                        <span>Kaydediliyor...</span>
                      </>
                    ) : success ? (
                      <>
                        <span className="text-lg">✓</span>
                        <span>Başarılı!</span>
                      </>
                    ) : (
                      <>
                        <span>Hesap Oluştur</span>
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
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-8 text-center"
              >
                <p className="text-gray-600 dark:text-gray-300 font-inter text-base">
                  Zaten hesabınız var mı?{' '}
                  <Link href="/login" className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline decoration-2 underline-offset-2">
                    Giriş Yapın
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-inter"
          >
            Kayıt olarak{' '}
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
