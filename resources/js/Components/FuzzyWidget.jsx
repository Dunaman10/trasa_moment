import React, { useState, useEffect } from "react";
import {
  Sliders,
  Check,
  Info,
  HelpCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";

// Package definition
const PACKAGES = [
  {
    id: "bronze",
    name: "Bronze (Personal / Grad)",
    desc: "Sempurna untuk sesi foto individu, wisuda, atau foto studio pribadi berdurasi singkat.",
    price: "Rp 1.250.000",
    features: [
      "1 Fotografer Profesional",
      "2 Jam Durasi Sesi",
      "25 Edited Photos",
      "All Raw Files (Google Drive)",
      "1 Lokasi / Studio",
    ],
    color:
      "from-amber-600 to-amber-700 bg-amber-500/10 text-amber-700 border-amber-200",
    badge: "Ekonomis & Singkat",
    bgGradient: "from-amber-700 via-amber-800 to-amber-900",
    textColor: "text-amber-200",
    btnColor: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30",
  },
  {
    id: "silver",
    name: "Silver (Intimate Event / Pre-wedding)",
    desc: "Ideal untuk dokumentasi lamaran, pre-wedding outdoor, atau acara keluarga berskala kecil.",
    price: "Rp 2.750.000",
    features: [
      "1 Fotografer + 1 Asisten",
      "4 Jam Durasi Sesi",
      "50 Edited Photos",
      "USB Drive Flashdisk Exclusive",
      "Cetak 1 Rangka Ukuran 16R",
      "Max. 100 Tamu Undangan",
    ],
    color:
      "from-slate-400 to-slate-500 bg-slate-500/10 text-slate-700 border-slate-200",
    badge: "Paling Populer untuk Lamaran",
    bgGradient: "from-slate-600 via-slate-700 to-slate-800",
    textColor: "text-slate-200",
    btnColor:
      "bg-slate-550 hover:bg-slate-500 bg-slate-600 text-white shadow-slate-900/30",
  },
  {
    id: "gold",
    name: "Gold (Standard Wedding / Big Event)",
    desc: "Dirancang khusus untuk pernikahan tradisional/modern berskala sedang dengan hasil premium.",
    price: "Rp 4.900.000",
    features: [
      "2 Fotografer + 1 Videografer",
      "8 Jam Durasi Sesi (Full-day)",
      "100 Edited Photos",
      "Exclusive Photobook Album",
      "Cinematic Video Highlight (3-5 menit)",
      "Cetak 2 Rangka Ukuran 16R",
      "Max. 500 Tamu Undangan",
    ],
    color:
      "from-yellow-500 to-yellow-600 bg-yellow-500/10 text-yellow-700 border-yellow-200",
    badge: "Pilihan Terbaik Pernikahan",
    bgGradient: "from-amber-600 via-yellow-600 to-amber-800",
    textColor: "text-yellow-200",
    btnColor:
      "bg-amber-500 hover:bg-amber-400 text-white shadow-amber-950/30 font-bold",
  },
  {
    id: "platinum",
    name: "Platinum (Grand Wedding & Premium Video)",
    desc: "Layanan terlengkap untuk dokumentasi pernikahan mewah berskala besar dan liputan cinematik penuh.",
    price: "Rp 8.500.000",
    features: [
      "3 Fotografer + 2 Videografer (Multicam)",
      "Durasi Sesi Fleksibel (Hingga 12 Jam)",
      "200 Edited Photos + All Raw Files",
      "Premium Box & 2 Exclusive Photobooks",
      "Cinematic Wedding Film (10-15 menit)",
      "Same Day Edit Video Clip Teaser",
      "Liputan Drone / Aerial Videography",
      "Tamu Undangan Tanpa Batas",
    ],
    color:
      "from-cyan-600 to-cyan-700 bg-cyan-500/10 text-cyan-700 border-cyan-200",
    badge: "Layanan Eksklusif VIP",
    bgGradient: "from-cyan-800 via-slate-800 to-slate-900",
    textColor: "text-cyan-300",
    btnColor: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30",
  },
];

// Helper functions for membership evaluation (Fuzzy Logic Mamdani Simulation)
const evaluateMembership = (budget, scale, duration) => {
  // Budget sets: Terbatas (<2M), Menengah (1.5M - 5M), Tinggi (>4M)
  // Scale sets: Intimate (<3), Standar (2.5 - 7.5), Grand (>6) (values 1-10)
  // Duration sets: Singkat (<4), Reguler (3 - 8), Seharian (>7) (values 1-12)

  // Fuzzification
  // 1. Budget membership
  const uBudgetTerbatas =
    budget <= 1500000
      ? 1
      : budget >= 3000000
        ? 0
        : (3000000 - budget) / 1500000;
  const uBudgetMenengah =
    budget <= 1500000 || budget >= 5000000
      ? 0
      : budget <= 3000000
        ? (budget - 1500000) / 1500000
        : (5000000 - budget) / 2000000;
  const uBudgetTinggi =
    budget <= 3500000
      ? 0
      : budget >= 5000000
        ? 1
        : (budget - 3500000) / 1500000;

  // 2. Scale membership
  const uScaleIntimate = scale <= 3 ? 1 : scale >= 6 ? 0 : (6 - scale) / 3;
  const uScaleStandar =
    scale <= 2 || scale >= 8
      ? 0
      : scale <= 5
        ? (scale - 2) / 3
        : (8 - scale) / 3;
  const uScaleGrand = scale <= 5 ? 0 : scale >= 8 ? 1 : (scale - 5) / 3;

  // 3. Duration membership
  const uDurationSingkat =
    duration <= 3 ? 1 : duration >= 6 ? 0 : (6 - duration) / 3;
  const uDurationReguler =
    duration <= 2 || duration >= 9
      ? 0
      : duration <= 5
        ? (duration - 2) / 3
        : (9 - duration) / 4;
  const uDurationSeharian =
    duration <= 6 ? 0 : duration >= 9 ? 1 : (duration - 6) / 3;

  // Rule Inference (Mamdani MIN operator)
  // Rule 1: IF Budget is Terbatas AND Scale is Intimate AND Duration is Singkat THEN Package is Bronze
  const scoreBronze = Math.min(
    uBudgetTerbatas,
    uScaleIntimate,
    uDurationSingkat,
  );

  // Rule 2: IF Budget is Menengah AND Scale is Intimate/Standar AND Duration is Singkat/Reguler THEN Package is Silver
  const scoreSilver = Math.min(
    uBudgetMenengah,
    Math.max(uScaleIntimate, uScaleStandar),
    Math.max(uDurationSingkat, uDurationReguler),
  );

  // Rule 3: IF Budget is Menengah/Tinggi AND Scale is Standar AND Duration is Reguler/Seharian THEN Package is Gold
  const scoreGold = Math.min(
    Math.max(uBudgetMenengah, uBudgetTinggi),
    uScaleStandar,
    Math.max(uDurationReguler, uDurationSeharian),
  );

  // Rule 4: IF Budget is Tinggi AND Scale is Grand AND Duration is Seharian THEN Package is Platinum
  const scorePlatinum = Math.min(uBudgetTinggi, uScaleGrand, uDurationSeharian);

  // Default heuristics logic when membership functions overlap or yield low scores:
  // We normalize and return matching weights
  const totalScore = scoreBronze + scoreSilver + scoreGold + scorePlatinum;

  // Fallback logic to map closest match if scores are all zero (e.g. edge cases)
  let weights = {
    bronze: scoreBronze,
    silver: scoreSilver,
    gold: scoreGold,
    platinum: scorePlatinum,
  };

  if (totalScore === 0) {
    // Fallback calculations based on distance
    const bDist =
      Math.abs(budget - 1250000) / 10000000 +
      Math.abs(scale - 2) / 10 +
      Math.abs(duration - 2) / 12;
    const sDist =
      Math.abs(budget - 2750000) / 10000000 +
      Math.abs(scale - 4) / 10 +
      Math.abs(duration - 4) / 12;
    const gDist =
      Math.abs(budget - 4900000) / 10000000 +
      Math.abs(scale - 6) / 10 +
      Math.abs(duration - 8) / 12;
    const pDist =
      Math.abs(budget - 8500000) / 10000000 +
      Math.abs(scale - 9) / 10 +
      Math.abs(duration - 10) / 12;

    const maxDist = Math.max(bDist, sDist, gDist, pDist);
    weights = {
      bronze: (maxDist - bDist) / maxDist,
      silver: (maxDist - sDist) / maxDist,
      gold: (maxDist - gDist) / maxDist,
      platinum: (maxDist - pDist) / maxDist,
    };
  }

  // Convert weights to percentage relevancy
  const maxVal = Math.max(
    weights.bronze,
    weights.silver,
    weights.gold,
    weights.platinum,
  );

  const finalScores = {
    bronze: Math.round((weights.bronze / (maxVal || 1)) * 100),
    silver: Math.round((weights.silver / (maxVal || 1)) * 100),
    gold: Math.round((weights.gold / (maxVal || 1)) * 100),
    platinum: Math.round((weights.platinum / (maxVal || 1)) * 100),
  };

  // Cap the highest one at 98-100%, adjust others relatively
  return finalScores;
};

export default function FuzzyWidget({ onSelectPackage }) {
  const [budget, setBudget] = useState(3000000); // 1M to 10M
  const [scale, setScale] = useState(5); // 1 to 10 scale (Intimate to Grand)
  const [duration, setDuration] = useState(6); // 1 to 12 hours
  const [scores, setScores] = useState({
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
  });
  const [bestMatch, setBestMatch] = useState("silver");

  useEffect(() => {
    const result = evaluateMembership(budget, scale, duration);
    setScores(result);
    let highest = "bronze";
    let maxVal = -1;
    Object.entries(result).forEach(([pkg, score]) => {
      if (score > maxVal) {
        maxVal = score;
        highest = pkg;
      }
    });
    setBestMatch(highest);
  }, [budget, scale, duration]);

  // Format currency string helper
  const formatIDR = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleBookingDirect = (packageName) => {
    const matched = PACKAGES.find((p) => p.name === packageName) || PACKAGES[0];
    if (onSelectPackage) {
      onSelectPackage(matched.name, matched.price, matched.desc);
    } else {
      alert(`Anda memilih untuk mem-booking Paket ${packageName}!`);
    }
  };

  return (
    <section
      id="rekomendasi"
      className="py-20 bg-slate-50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header text */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-deep">
            Cari Paket Fotografi Sesuai Kebutuhan Anda
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Gunakan kalkulator pintar kami untuk menemukan paket dokumentasi
            yang paling sesuai dengan kebutuhan Anda secara otomatis.
          </p>
        </div>

        {/* Main Widget Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Sliders Controls (Input Fuzzifikasi) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100/50 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="bg-brand-primary/10 p-2 rounded-xl text-brand-primary">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-brand-deep">
                  Parameter Input
                </h3>
                <p className="text-xs text-slate-400">
                  Atur slider di bawah sesuai kebutuhan
                </p>
              </div>
            </div>

            {/* Slider 1: Budget */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  Anggaran (Budget)
                  <HelpCircle
                    className="w-4 h-4 text-slate-300 hover:text-slate-500 cursor-help"
                    title="Rentang biaya yang direncanakan"
                  />
                </span>
                <span className="text-brand-primary font-bold">
                  {formatIDR(budget)}
                </span>
              </div>
              <input
                type="range"
                min="1000000"
                max="10000000"
                step="250000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="flex justify-between text-2xs text-slate-400 font-medium">
                <span>Terbatas (&lt; Rp 2jt)</span>
                <span>Menengah (Rp 2jt - 5jt)</span>
                <span>Tinggi (&gt; Rp 5jt)</span>
              </div>
            </div>

            {/* Slider 2: Skala Acara */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  Skala & Kerumitan Acara
                  <HelpCircle
                    className="w-4 h-4 text-slate-300 hover:text-slate-500 cursor-help"
                    title="Besaran jumlah tamu dan kerumitan manajemen sesi"
                  />
                </span>
                <span className="text-brand-primary font-bold">
                  {scale <= 3
                    ? "Intimate (Kecil)"
                    : scale <= 7
                      ? "Standar (Sedang)"
                      : "Grand (Besar)"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="flex justify-between text-2xs text-slate-400 font-medium">
                <span>Intimate (1-3)</span>
                <span>Standar (4-7)</span>
                <span>Grand (8-10)</span>
              </div>
            </div>

            {/* Slider 3: Durasi */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  Durasi Liputan (Jam)
                  <HelpCircle
                    className="w-4 h-4 text-slate-300 hover:text-slate-500 cursor-help"
                    title="Lama waktu sesi foto / liputan di lokasi"
                  />
                </span>
                <span className="text-brand-primary font-bold">
                  {duration} Jam
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="flex justify-between text-2xs text-slate-400 font-medium">
                <span>Singkat (1-3 jam)</span>
                <span>Reguler (4-7 jam)</span>
                <span>Seharian (8-12 jam)</span>
              </div>
            </div>

            {/* Fuzzy Membership Info Banner */}
            <div className="bg-brand-light/20 border border-brand-accent/20 rounded-2xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-brand-dark flex-shrink-0 mt-0.5" />
              <p className="text-xs text-brand-dark/90 leading-relaxed">
                Rekomendasi dihitung secara langsung berdasarkan kecocokan
                antara alokasi anggaran, skala acara, dan durasi sesi yang Anda
                inginkan.
              </p>
            </div>
          </div>

          {/* Right Side: Recommendation Results & Best Match */}
          <div className="lg:col-span-7 space-y-6">
            {/* Summary Bar chart of Relevancy */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100/50 space-y-4">
              <h4 className="font-bold text-slate-800 text-sm tracking-wide uppercase">
                Derajat Kecocokan Paket (Relevansi)
              </h4>
              <div className="space-y-3.5">
                {PACKAGES.map((pkg) => {
                  const score = scores[pkg.id] || 0;
                  const isBest = bestMatch === pkg.id;
                  return (
                    <div key={pkg.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm font-semibold">
                        <span
                          className={
                            isBest
                              ? "text-brand-deep font-bold flex items-center gap-1.5"
                              : "text-slate-500"
                          }
                        >
                          {pkg.name}
                          {isBest && (
                            <span className="text-3xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200">
                              Terbaik
                            </span>
                          )}
                        </span>
                        <span
                          className={
                            isBest
                              ? "text-brand-primary font-bold"
                              : "text-slate-400"
                          }
                        >
                          {score}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isBest
                              ? "bg-gradient-to-r from-brand-primary to-brand-dark"
                              : "bg-slate-300"
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Best Match Detail Card */}
            {(() => {
              const bestPkg =
                PACKAGES.find((p) => p.id === bestMatch) || PACKAGES[0];
              return (
                <div
                  className={`bg-gradient-to-r ${bestPkg.bgGradient} rounded-3xl text-white shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300`}
                >
                  {/* Deco Sparkle Background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 backdrop-blur-sm animate-pulse">
                    <Sparkles className={`w-4 h-4 ${bestPkg.textColor}`} />
                    <span>Rekomendasi Utama: {bestPkg.badge}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 mb-6">
                    <div>
                      <h3 className="text-2xl font-extrabold tracking-tight">
                        {bestPkg.name}
                      </h3>
                      <p className="text-xs text-slate-300/90 mt-1">
                        {bestPkg.desc}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-3xs uppercase tracking-widest text-slate-300 font-bold">
                        Harga Paket
                      </span>
                      <h4
                        className={`text-2xl font-black ${bestPkg.textColor}`}
                      >
                        {bestPkg.price}
                      </h4>
                    </div>
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs uppercase tracking-widest text-slate-300 font-bold mb-4">
                      Termasuk Layanan
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {bestPkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div
                            className={`bg-white/10 p-1 rounded-md ${bestPkg.textColor} mt-0.5`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm text-slate-200">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <button
                      onClick={() => handleBookingDirect(bestPkg.name)}
                      className={`w-full sm:w-auto font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2 ${bestPkg.btnColor}`}
                    >
                      Booking Paket Ini
                    </button>
                    <a
                      href="#layanan"
                      className="text-xs sm:text-sm text-slate-300 hover:text-white font-medium flex items-center gap-1 group py-2"
                    >
                      Bandingkan dengan paket lain
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
