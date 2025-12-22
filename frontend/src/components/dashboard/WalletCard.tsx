"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, X, ArrowUpRight, ArrowDownLeft, Wallet, Clock, ShieldCheck, Landmark, Building2 } from "lucide-react";

// --- YARDIMCI FORMAT FONKSİYONLARI ---
const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const parts = [];
  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.substr(i, 4));
  }
  return parts.length > 1 ? parts.join(" ") : value;
};

const formatExpiryDate = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  if (v.length >= 2) {
    return v.substr(0, 2) + "/" + v.substr(2, 2);
  }
  return v;
};

const formatIBAN = (value: string) => {
  let v = value.replace(/\s+/g, "").toUpperCase();
  const parts = [];
  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.substr(i, 4));
  }
  return parts.join(" ");
};

// --- TİPLER ---
type Transaction = {
  id: number;
  type: 'deposit' | 'payment' | 'withdraw';
  amount: number;
  description: string;
  date: string;
  time: string;
  status?: 'completed' | 'pending';
};

interface WalletCardProps {
  userType?: 'brand' | 'influencer'; 
}

export default function WalletCard({ userType = 'brand' }: WalletCardProps) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Modal Kontrolleri
  const [showActionModal, setShowActionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Form State'leri
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Kart Bilgileri
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  // IBAN Bilgileri
  const [iban, setIban] = useState("TR");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  // Hareket Listesi
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Token Alma Yardımcısı
  const getToken = () => {
    // Bazen 'token' bazen 'access_token' olarak kaydediliyor, ikisine de bakalım
    return localStorage.getItem("access_token") || localStorage.getItem("token");
  };

  // 1. VERİLERİ BACKEND'DEN ÇEK 📥
  const fetchWallet = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        console.warn("Kullanıcı girişi yapılmamış (Token yok).");
        setLoading(false);
        return;
      }
      
      const response = await axios.get("http://localhost:8000/finance/wallet", {
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (response.data) {
        setBalance(response.data.balance);
        setTransactions(response.data.transactions || []);
      }
    } catch (error) {
      console.log("Cüzdan verisi çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // ... INPUT HANDLERS (AYNI KALDI) ...
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length <= 16) setCardNumber(formatCardNumber(val));
  };
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 4) val = val.substr(0, 4);
    if (val.length >= 2) {
      const month = parseInt(val.substr(0, 2));
      if (month > 12) val = "12" + val.substr(2);
      if (month === 0) val = "01" + val.substr(2);
    }
    setCardExpiry(formatExpiryDate(val));
  };
  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length <= 3) setCardCVC(val);
  };
  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (val.length > 26) val = val.substr(0, 26);
    setIban(formatIBAN(val));
  };

  // 2. İŞLEMİ BACKEND'E GÖNDER 📤
  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const token = getToken();
      if (!token) {
        alert("Lütfen önce giriş yapın.");
        setIsProcessing(false);
        return;
      }

      const transAmount = parseFloat(amount);
      let endpoint = "";
      let payload = {};

      if (userType === 'brand') {
        endpoint = "http://localhost:8000/finance/deposit";
        payload = { amount: transAmount, card_number: cardNumber };
      } else {
        endpoint = "http://localhost:8000/finance/withdraw";
        payload = { amount: transAmount, iban: iban };
      }

      await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchWallet();
      
      alert(userType === 'brand' ? "Yükleme Başarılı! 💸" : "Çekim Talebi Alındı! ✅");
      setShowActionModal(false);
      
      // Formu Temizle
      setAmount("");
      setCardNumber(""); setCardName(""); setCardExpiry(""); setCardCVC("");
      setIban("TR"); setBankName(""); setAccountHolder("");

    } catch (error) {
      console.error("İşlem hatası:", error);
      alert("İşlem başarısız. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* --- ANA KART --- */}
      <div className={`rounded-2xl shadow-xl p-6 text-white mb-8 relative overflow-hidden ring-1 ring-white/10 ${userType === 'brand' ? 'bg-gradient-to-r from-blue-700 to-indigo-800' : 'bg-gradient-to-r from-purple-700 to-pink-800'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${userType === 'brand' ? 'bg-blue-500/30' : 'bg-purple-500/30'}`}>
                <Wallet className="w-4 h-4 text-white/90" />
              </div>
              <span className="text-white/80 text-sm font-medium tracking-wide">
                {userType === 'brand' ? 'ŞİRKET BAKİYESİ' : 'KAZANÇ BAKİYESİ'}
              </span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">
              {loading ? "..." : `₺${balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
            </h2>
          </div>
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
             <ShieldCheck className="w-8 h-8 text-green-300" />
          </div>
        </div>

        <div className="mt-8 flex gap-3 relative z-10">
          <button 
            onClick={() => setShowActionModal(true)}
            className={`flex-1 font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-black/10 active:scale-[0.98] flex items-center justify-center gap-2 ${userType === 'brand' ? 'bg-white text-blue-800 hover:bg-blue-50' : 'bg-white text-purple-800 hover:bg-purple-50'}`}
          >
            {userType === 'brand' ? (
              <>
                <ArrowDownLeft className="w-5 h-5" />
                Bakiye Yükle
              </>
            ) : (
              <>
                <Landmark className="w-5 h-5" />
                Para Çek
              </>
            )}
          </button>
          <button 
            onClick={() => setShowHistoryModal(true)}
            className="flex-1 bg-black/20 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-black/30 transition-all border border-white/10 backdrop-blur-md flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Clock className="w-5 h-5" />
            Hareketler
          </button>
        </div>
      </div>

      {/* --- MODAL --- */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-slate-700">
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {userType === 'brand' ? (
                  <><CreditCard className="w-5 h-5 text-blue-600" /> Bakiye Yükle</>
                ) : (
                  <><Building2 className="w-5 h-5 text-purple-600" /> Bankaya Aktar</>
                )}
              </h3>
              <button onClick={() => setShowActionModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleTransaction} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {userType === 'brand' ? 'Yüklenecek Tutar' : 'Çekilecek Tutar'}
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">₺</span>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xl font-bold text-gray-900 dark:text-white transition-all placeholder:text-gray-300"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {userType === 'brand' ? (
                <div className="space-y-4 pt-2">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kart Bilgileri</label>
                     <div className="relative">
                       <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                       <input 
                        type="text" 
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000" 
                        maxLength={19}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                     </div>
                  </div>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="AA/YY" 
                      maxLength={5}
                      className="w-1/2 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-center font-mono outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                      type="text"
                      required
                      value={cardCVC}
                      onChange={handleCVCChange}
                      placeholder="CVC" 
                      maxLength={3}
                      className="w-1/2 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-center font-mono outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hesap Sahibi</label>
                    <input 
                      type="text" 
                      required
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                      placeholder="AD SOYAD" 
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Banka Adı</label>
                    <input 
                      type="text" 
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Örn: Garanti BBVA" 
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">IBAN</label>
                    <input 
                      type="text" 
                      required
                      value={iban}
                      onChange={handleIbanChange}
                      placeholder="TR00 0000 0000 0000 0000 0000 00" 
                      maxLength={32}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 outline-none uppercase"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isProcessing}
                className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${userType === 'brand' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'}`}
              >
                {isProcessing ? "İşleniyor..." : (userType === 'brand' ? "Ödemeyi Onayla" : "Çekim Talebi Oluştur")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- HAREKETLER --- */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh] border border-gray-100 dark:border-slate-700">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-gray-600" />
                Hesap Hareketleri
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-0 overflow-y-auto flex-1 bg-white dark:bg-slate-900">
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 opacity-50" />
                  </div>
                  <p>Henüz bir işlem hareketi bulunmuyor.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th className="px-6 py-4">İşlem Detayı</th>
                      <th className="px-6 py-4">Tarih</th>
                      <th className="px-6 py-4 text-right">Tutar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                              tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                              tx.type === 'withdraw' ? 'bg-orange-100 text-orange-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {tx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : 
                               tx.type === 'withdraw' ? <Landmark className="w-5 h-5" /> :
                               <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">{tx.description}</p>
                              {tx.status === 'pending' && <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">ONAY BEKLİYOR</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{tx.date} {tx.time}</td>
                        <td className={`px-6 py-4 text-right font-bold text-base ${
                          tx.type === 'deposit' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}₺{tx.amount.toLocaleString('tr-TR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}