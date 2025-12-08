'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { RoleType, RegisterInfluencerData, RegisterBrandData } from '@/types/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<RoleType>('influencer');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">ReklaGram</h2>
          <p className="mt-2 text-sm text-gray-600">Hesap oluşturun ve başlayın</p>
        </div>

        {/* Role Toggle */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setRole('influencer')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              role === 'influencer'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎬 Influencer
          </button>
          <button
            type="button"
            onClick={() => setRole('brand')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              role === 'brand'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            🏢 Marka
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            ✅ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-posta <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre Tekrar <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Influencer Specific Fields */}
          {role === 'influencer' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900">Influencer Bilgileri</h3>
              
              <div>
                <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Görünen Ad <span className="text-red-500">*</span>
                </label>
                <input
                  id="display_name"
                  name="display_name"
                  type="text"
                  required
                  value={formData.display_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="instagram_username" className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <input
                    id="instagram_username"
                    name="instagram_username"
                    type="text"
                    value={formData.instagram_username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="tiktok_username" className="block text-sm font-medium text-gray-700 mb-1">
                    TikTok
                  </label>
                  <input
                    id="tiktok_username"
                    name="tiktok_username"
                    type="text"
                    value={formData.tiktok_username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="youtube_channel_url" className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Kanal URL
                </label>
                <input
                  id="youtube_channel_url"
                  name="youtube_channel_url"
                  type="url"
                  value={formData.youtube_channel_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
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
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Konum
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Biyografi
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>
          )}

          {/* Brand Specific Fields */}
          {role === 'brand' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900">Marka Bilgileri</h3>
              
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Şirket Adı <span className="text-red-500">*</span>
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                    Sektör
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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

                <div>
                  <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1">
                    Web Sitesi
                  </label>
                  <input
                    id="website_url"
                    name="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-1">
                    İletişim Kişisi
                  </label>
                  <input
                    id="contact_person"
                    name="contact_person"
                    type="text"
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
              role === 'influencer'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Kaydediliyor...' : success ? 'Başarılı!' : 'Hesap Oluştur'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Zaten hesabınız var mı?{' '}
          <a href="/login" className="font-medium text-purple-600 hover:text-purple-500">
            Giriş Yapın
          </a>
        </p>
      </div>
    </div>
  );
}

