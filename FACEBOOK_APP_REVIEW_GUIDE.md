# Facebook/Instagram API - Production (Canlı) Kullanım Rehberi

## Neden App Review Gerekli?
Facebook Developer Console'da oluşturduğun uygulama varsayılan olarak **Development Mode**'da. Bu modda:
- ❌ Sadece sen ve test kullanıcıların bağlanabilir
- ❌ Herhangi bir influencer "Bağla" butonuna basınca hata alır
- ✅ Test amaçlı kullanım için yeterli

**Production (Live) Mode** için **App Review** sürecinden geçmelisin.

---

## Adım Adım App Review Süreci

### 1. Meta for Developers'a Git
https://developers.facebook.com/apps/

### 2. Uygulamayı Seç
- Sol menüden **"App Review"** > **"Permissions and Features"**

### 3. Gerekli İzinleri İste

#### A) **pages_show_list** (ZORUNLU)
- **Açıklama:** "Kullanıcılarımızın (influencerlar) Instagram hesaplarını bağlamak için Facebook sayfalarını listelememiz gerekiyor."
- **Kullanım Amacı:** "Influencerların Instagram Business/Creator hesaplarını platformumuza bağlayarak istatistiklerini çekmek ve marka iş birlikleri sunmak için."

#### B) **instagram_basic** (ZORUNLU)
- **Açıklama:** "Influencerların Instagram kullanıcı adı, takipçi sayısı ve profil bilgilerini almak için."
- **Kullanım Amacı:** "Platformumuzda influencerların profillerini oluşturmak ve markalarla eşleştirmek."

#### C) **instagram_manage_insights** (ÖNERİLEN)
- **Açıklama:** "Influencerların etkileşim oranı, erişim ve kitle demografisi gibi istatistikleri çekmek için."
- **Kullanım Amacı:** "Markalara doğru ve güncel veriler sunarak şeffaf iş birlikleri sağlamak."

#### D) **pages_read_engagement** (ÖNERİLEN)
- **Açıklama:** "Bağlı Instagram hesaplarının etkileşim verilerini okumak için."

### 4. Ekran Görüntüleri ve Video Hazırla

**Meta'nın İstediği Materyaller:**
- ✅ **Login ekranı** (influencer olarak giriş)
- ✅ **"Instagram'ı Bağla" butonu** ekran görüntüsü
- ✅ **İzin ekranı** (kullanıcı onaylıyor)
- ✅ **Başarılı bağlantı sonrası** profil sayfası
- ✅ **1-2 dakikalık demo video** (yukarıdaki akışı göster)

**Video İçeriği Örneği:**
1. Influencer olarak giriş yap
2. Profil sayfasına git
3. "Bağla" butonuna tıkla
4. Facebook'a yönlendir
5. İzinleri onayla
6. Başarılı bağlantıyı göster

### 5. Gerekli Dökümanlar

**Business Verification (İşletme Doğrulaması):**
- Şirket belgesi (Ticaret sicil kaydı)
- Vergi kimlik belgesi
- Resmi web sitesi: `reklagram.com` (veya aktif domain)

### 6. İnceleme Süresi
- ⏱️ Ortalama: **3-5 iş günü**
- 📧 Sonuç: Email ile bildirilir
- ❓ Ret durumunda: Eksikleri tamamla ve tekrar başvur

---

## App Review Onaylanınca Ne Olur?

✅ **Herhangi bir kullanıcı** (test kullanıcısı değil) "Bağla" butonuna basınca bağlanabilir
✅ Uygulama **Live Mode**'a geçer
✅ Production URL'lerini kullanabilirsin (`https://reklagram.com`)

---

## Geçiş Süreci (Development → Live)

### Development (Şu an)
```env
NEXT_PUBLIC_FACEBOOK_APP_ID=YOUR_APP_ID
INSTAGRAM_REDIRECT_URI=http://localhost:3000/instagram-callback
```

### Production (App Review sonrası)
```env
NEXT_PUBLIC_FACEBOOK_APP_ID=YOUR_APP_ID
INSTAGRAM_REDIRECT_URI=https://reklagram.com/instagram-callback
```

**Önemli:** Facebook Developer Console'da **Valid OAuth Redirect URIs** kısmına production URL'ini ekle:
- `https://reklagram.com/instagram-callback`
- `https://www.reklagram.com/instagram-callback`

---

## Sık Sorulan Sorular

**S: App Review olmadan test edebilir miyim?**
C: Evet, sadece sen ve eklediğin test kullanıcıları ile. 

**S: App Review reddedilirse ne olur?**
C: Meta eksiklikleri belirtir, düzeltip tekrar başvurursun.

**S: Her güncelleme için App Review gerekir mi?**
C: Hayır, sadece yeni izinler eklersen gerekir.

**S: Ücretli mi?**
C: Hayır, tamamen ücretsiz.

---

## İletişim ve Destek

Meta Developer Support: https://developers.facebook.com/support/
