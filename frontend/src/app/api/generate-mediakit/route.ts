import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      displayName, username, bio, profileImage, 
      followers, engagementRate, avgLikes, avgComments,
      contactEmail, recentPosts,
      // YENİ EKLENEN VERİLER:
      audienceGender, // { women: 65, men: 35 }
      audienceAge     // [{ range: '18-24', percent: 45 }, ...]
    } = body;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        body { margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-print-color-adjust: exact; box-sizing: border-box; }
        .page { width: 794px; height: 1122px; position: relative; background: #fff; overflow: hidden; }
        
        /* HEADER & AVATAR */
        .header { background: linear-gradient(135deg, #1A2A6C 0%, #7C3AED 50%, #F97316 100%); height: 260px; color: white; padding: 40px 50px; display: flex; align-items: center; justify-content: space-between; clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%); }
        .profile-info { display: flex; align-items: center; gap: 25px; }
        .avatar { width: 140px; height: 140px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.4); object-fit: cover; background: white; }
        .identity h1 { margin: 0; font-size: 32px; font-weight: 800; }
        .identity h2 { margin: 5px 0 0; font-size: 16px; font-weight: 500; opacity: 0.9; }
        .brand-logo { font-size: 20px; font-weight: 800; opacity: 0.8; letter-spacing: 2px; }

        /* CONTENT */
        .container { padding: 30px 50px; display: flex; flex-direction: column; gap: 30px; }
        
        /* STATS GRID */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
        .stat-card { background: #F8F9FD; padding: 15px; border-radius: 12px; text-align: center; border: 1px solid #e5e7eb; }
        .stat-value { font-size: 24px; font-weight: 800; color: #1A2A6C; margin-bottom: 4px; }
        .stat-label { font-size: 10px; color: #6b7280; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .stat-card.highlight { background: #EEF2FF; border-color: #C7D2FE; }
        .stat-card.highlight .stat-value { color: #4F46E5; }

        /* DEMOGRAPHICS SECTION (YENİ) */
        .demographics-container { display: flex; gap: 30px; }
        .demo-box { flex: 1; background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
        .section-header { font-size: 14px; font-weight: 700; color: #1A2A6C; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid #F97316; display: inline-block; padding-bottom: 4px; }

        /* GENDER BAR */
        .gender-bar-container { display: flex; height: 24px; border-radius: 12px; overflow: hidden; margin-bottom: 10px; }
        .gender-f { background: #EC4899; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold; }
        .gender-m { background: #3B82F6; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold; }
        .gender-legend { display: flex; justify-content: space-between; font-size: 12px; color: #555; font-weight: 600; }

        /* AGE BARS */
        .age-row { display: flex; align-items: center; margin-bottom: 8px; font-size: 12px; }
        .age-label { width: 40px; font-weight: 600; color: #444; }
        .age-track { flex: 1; background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden; margin: 0 10px; }
        .age-fill { background: #7C3AED; height: 100%; border-radius: 4px; }
        .age-val { width: 30px; text-align: right; font-weight: bold; color: #7C3AED; }

        /* RECENT MEDIA */
        .media-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .media-item { position: relative; aspect-ratio: 1/1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .media-img { width: 100%; height: 100%; object-fit: cover; }
        .media-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 15px 10px 10px; display: flex; justify-content: space-around; color: white; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px; }

        /* FOOTER */
        .footer { position: absolute; bottom: 30px; left: 50px; right: 50px; background: #111827; color: white; padding: 20px 30px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; }
        .contact-label { font-size: 9px; opacity: 0.6; text-transform: uppercase; display: block; margin-bottom: 2px;}
        .contact-value { font-size: 14px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div class="profile-info">
            <img src="${profileImage}" class="avatar" />
            <div class="identity">
              <h1>${displayName}</h1>
              <h2>@${username}</h2>
            </div>
          </div>
          <div class="brand-logo">MEDIA KIT</div>
        </div>

        <div class="container">
          <div style="font-size: 14px; color: #4b5563; line-height: 1.5; margin-bottom: 10px;">
             ${bio.substring(0, 250)}${bio.length > 250 ? '...' : ''}
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${followers}</div>
              <div class="stat-label">Takipçi</div>
            </div>
            <div class="stat-card highlight">
              <div class="stat-value">%${engagementRate}</div>
              <div class="stat-label">Etkileşim</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${avgLikes}</div>
              <div class="stat-label">Ort. Beğeni</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${avgComments}</div>
              <div class="stat-label">Ort. Yorum</div>
            </div>
          </div>

          <div class="demographics-container">
            <div class="demo-box">
              <div class="section-header">Kitle Cinsiyeti</div>
              <div class="gender-bar-container">
                <div class="gender-f" style="width: ${audienceGender.women}%">${audienceGender.women}%</div>
                <div class="gender-m" style="width: ${audienceGender.men}%">${audienceGender.men}%</div>
              </div>
              <div class="gender-legend">
                <span style="color:#EC4899">● Kadın</span>
                <span style="color:#3B82F6">● Erkek</span>
              </div>
            </div>
            
            <div class="demo-box">
              <div class="section-header">Yaş Dağılımı (Top 4)</div>
              ${audienceAge.map((item: any) => `
                <div class="age-row">
                  <div class="age-label">${item.range}</div>
                  <div class="age-track">
                    <div class="age-fill" style="width: ${item.percent}%"></div>
                  </div>
                  <div class="age-val">%${item.percent}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <div class="section-header">Son Performans</div>
            <div class="media-grid">
              ${recentPosts.map((post: any) => `
                <div class="media-item">
                  <img src="${post.imageUrl}" class="media-img" />
                  <div class="media-overlay">
                    <span>❤️ ${post.likes}</span>
                    <span>💬 ${post.comments}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="footer">
          <div>
            <span class="contact-label">İletişim</span>
            <span class="contact-value">${contactEmail}</span>
          </div>
          <div style="text-align: right;">
            <span class="contact-label">Doğrulanmış Profil</span>
            <span class="contact-value">ReklaGram ✓</span>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    // Puppeteer Başlatma (Mevcut kodun aynısı)
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    const fileName = `mediakits/${username}-${Date.now()}.pdf`;
    await s3.send(new PutObjectCommand({
      Bucket: "reklagram-media-kits",
      Key: fileName,
      Body: pdfBuffer,
      ContentType: "application/pdf",
    }));

    const fileUrl = `https://reklagram-media-kits.s3.eu-central-1.amazonaws.com/${fileName}`;

    return NextResponse.json({ success: true, url: fileUrl });

  } catch (error: any) {
    console.error("PDF Hatası:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}