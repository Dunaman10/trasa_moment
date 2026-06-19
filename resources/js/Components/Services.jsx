import React from "react";
import { Check, ShieldCheck, Heart, GraduationCap, Camera, Film } from "lucide-react";

const SERVICES_CATALOG = [
    {
        name: "Bronze Package",
        icon: Camera,
        category: "Personal / Graduation",
        price: "Rp 1.250.000",
        desc: "Layanan hemat untuk foto individu studio, wisuda, pasfoto formal, atau portrait portofolio profesional.",
        features: ["1 Fotografer Utama", "2 Jam Durasi Sesi", "25 Edited Photos (Lightroom & PS)", "All Raw Files delivered via Google Drive", "Studio Background / 1 Lokasi Pilihan"],
        accent: "border-slate-100 hover:border-amber-400 bg-amber-500/5 text-amber-600",
        buttonStyle: "bg-slate-800 text-white hover:bg-brand-primary"
    },
    {
        name: "Silver Package",
        icon: Heart,
        category: "Intimate / Pre-wedding",
        price: "Rp 2.750.000",
        desc: "Dokumentasi hangat untuk pre-wedding outdoor romantis, acara tunangan (engagement), atau ulang tahun keluarga.",
        features: ["1 Fotografer + 1 Asisten Kru", "4 Jam Durasi Sesi", "50 Edited Photos Premium", "Flashdisk Eksklusif isi file foto", "Cetak Frame Minimalis 16R (1 pcs)", "Ideal untuk max. 100 tamu undangan"],
        accent: "border-slate-100 hover:border-slate-400 bg-slate-500/5 text-slate-600",
        buttonStyle: "bg-slate-800 text-white hover:bg-brand-primary"
    },
    {
        name: "Gold Package",
        icon: Film,
        category: "Wedding / Large Event",
        price: "Rp 4.900.000",
        desc: "Rekomendasi utama untuk liputan pernikahan (wedding day) tradisional maupun modern berskala sedang secara menyeluruh.",
        features: ["2 Fotografer + 1 Videografer", "8 Jam Durasi Sesi (Full-day)", "100 Edited Photos Resolusi Tinggi", "Album Photobook Eksklusif (20 halaman)", "Video Cinematic Highlight (3-5 menit)", "Cetak Frame Minimalis 16R (2 pcs)", "Cocok untuk max. 500 tamu"],
        accent: "border-brand-primary bg-brand-primary/5 text-brand-primary shadow-xl ring-2 ring-brand-primary/20 scale-105 relative z-10",
        buttonStyle: "bg-brand-primary text-white hover:bg-brand-dark",
        popular: true
    },
    {
        name: "Platinum Package",
        icon: ShieldCheck,
        category: "Grand Wedding VIP",
        price: "Rp 8.500.000",
        desc: "Layanan VIP termewah untuk hari pernikahan akbar. Menawarkan liputan multi-angle cinematic dan dokumentasi udara.",
        features: ["3 Fotografer + 2 Videografer", "Sesi Fleksibel (Hingga 12 Jam)", "200 Edited Photos + All Raw Files", "2 Album Photobook Box Kayu Eksklusif", "Video Cinematic Doc (10-15 menit)", "Video Teaser Same-Day Edit (SDE)", "Liputan Video Drone Udara", "Kapasitas Tamu Tanpa Batas"],
        accent: "border-slate-100 hover:border-cyan-400 bg-cyan-500/5 text-cyan-600",
        buttonStyle: "bg-slate-800 text-white hover:bg-brand-primary"
    }
];

export default function Services({ onSelectPackage, packages }) {
    const activePackages = packages && packages.length > 0 ? packages.map((pkg, idx) => {
        let icon = Camera;
        let category = "Personal / Graduation";
        let accent = "border-slate-100 hover:border-amber-400 bg-amber-50/50 text-amber-600";
        let buttonStyle = "bg-slate-800 text-white hover:bg-brand-primary";
        let popular = false;

        const slug = pkg.name.toLowerCase();
        if (slug.includes("bronze")) {
            icon = Camera;
            category = "Personal / Graduation";
            accent = "border-slate-100 hover:border-amber-400 bg-amber-500/5 text-amber-600";
            buttonStyle = "bg-slate-800 text-white hover:bg-brand-primary";
        } else if (slug.includes("silver")) {
            icon = Heart;
            category = "Intimate / Pre-wedding";
            accent = "border-slate-100 hover:border-slate-400 bg-slate-500/5 text-slate-600";
            buttonStyle = "bg-slate-800 text-white hover:bg-brand-primary";
        } else if (slug.includes("gold")) {
            icon = Film;
            category = "Wedding / Large Event";
            accent = "border-brand-primary bg-brand-primary/5 text-brand-primary shadow-xl ring-2 ring-brand-primary/20 scale-105 relative z-10";
            buttonStyle = "bg-brand-primary text-white hover:bg-brand-dark";
            popular = true;
        } else if (slug.includes("platinum")) {
            icon = ShieldCheck;
            category = "Grand Wedding VIP";
            accent = "border-slate-100 hover:border-cyan-400 bg-cyan-500/5 text-cyan-600";
            buttonStyle = "bg-slate-800 text-white hover:bg-brand-primary";
        }

        return {
            id: pkg.id,
            name: pkg.name,
            icon,
            category,
            price: pkg.formatted_price || `Rp ${Number(pkg.base_price).toLocaleString('id-ID')}`,
            desc: pkg.description,
            features: slug.includes("bronze") ? SERVICES_CATALOG[0].features :
                      slug.includes("silver") ? SERVICES_CATALOG[1].features :
                      slug.includes("gold") ? SERVICES_CATALOG[2].features : SERVICES_CATALOG[3].features,
            accent,
            buttonStyle,
            popular
        };
    }) : SERVICES_CATALOG;

    const handleSelectService = (name) => {
        const matched = activePackages.find((p) => p.name === name) || activePackages[0];
        if (onSelectPackage) {
            onSelectPackage(matched, matched.price, matched.desc);
        } else {
            alert(`Anda memilih ${name}.`);
        }
    };

    return (
        <section id="layanan" className="py-12 lg:py-20 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-20 space-y-3">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-brand-light/30 px-4 py-1.5 rounded-full">
                        Katalog Layanan
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-deep">
                        Pilihan Paket Fotografi & Videografi
                    </h2>
                    <p className="text-slate-500 text-base sm:text-lg">
                        Bandingkan detail fitur dari masing-masing paket standar kami untuk menemukan kecocokan terbaik bagi momen spesial Anda.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 items-stretch">
                    {activePackages.map((pkg, idx) => {
                        const Icon = pkg.icon;
                        return (
                            <div
                                key={idx}
                                className={`flex flex-col justify-between rounded-3xl p-5 lg:p-6 border-2 transition-all duration-300 hover:shadow-2xl bg-white relative ${pkg.accent.replace("scale-105", "")}`}
                            >
                                <div>
                                    {/* Popular tag */}
                                    {pkg.popular && (
                                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-3xs font-extrabold px-4.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                                            Paling Direkomendasikan
                                        </span>
                                    )}

                                    {/* Icon & Title */}
                                    <div className="flex items-center gap-2.5 mb-4 lg:mb-6">
                                        <div className="bg-slate-50 p-2.5 rounded-2xl text-slate-800">
                                            <Icon className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <div>
                                            <span className="text-3xs uppercase tracking-widest text-slate-400 font-bold block">
                                                {pkg.category}
                                            </span>
                                            <h3 className="font-extrabold text-base text-brand-deep leading-tight">
                                                {pkg.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4">
                                        <span className="text-3xs uppercase tracking-widest text-slate-400 font-bold block">Investasi Mulai</span>
                                        <h4 className="text-2xl font-black text-brand-deep">{pkg.price}</h4>
                                    </div>

                                    <p className="text-xs text-slate-500 leading-relaxed mb-6 border-b border-slate-100 pb-6">
                                        {pkg.desc}
                                    </p>

                                    {/* Features list */}
                                    <ul className="space-y-3 mb-8">
                                        {pkg.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-600">
                                                <Check className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Booking Button */}
                                <button
                                    onClick={() => handleSelectService(pkg.name)}
                                    className={`w-full text-center py-3 rounded-full text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer active:scale-[0.98] ${pkg.buttonStyle}`}
                                >
                                    Pilih Paket
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
