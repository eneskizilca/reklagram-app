"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

function InstagramCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code"); // URL'deki kodu yakala
  const [status, setStatus] = useState("İşleniyor...");

  useEffect(() => {
    if (code) {
      // Kodu Backend'e gönder
      const sendCodeToBackend = async () => {
        try {
          const token = localStorage.getItem("access_token"); // Kullanıcının JWT'si
          await axios.post(
            "http://localhost:8000/instagram/connect",
            { code }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setStatus("Başarılı! Yönlendiriliyorsunuz...");
          setTimeout(() => router.push("/influencer/profile"), 2000); // Profile geri dön
        } catch (error: any) {
          console.error("Full error:", error);
          console.error("Error response:", error.response?.data);
          const errorMsg = error.response?.data?.detail || error.message || "Bilinmeyen hata";
          setStatus(`Hata: ${errorMsg}`);
        }
      };
      sendCodeToBackend();
    }
  }, [code, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">{status}</h1>
    </div>
  );
}

export default function InstagramCallback() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><h1 className="text-2xl font-bold">Yükleniyor...</h1></div>}>
      <InstagramCallbackContent />
    </Suspense>
  );
}