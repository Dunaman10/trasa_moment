import React from "react";
import { Sparkles, Calendar, ArrowDown } from "lucide-react";

export default function Hero({ data }) {
    const scrollToWidget = () => {
        document.getElementById("rekomendasi")?.scrollIntoView({ behavior: "smooth" });
    };

    const title = data?.title || "Abadikan Setiap Momen Berharga Anda";
    const subtitle = data?.subtitle || "Temukan paket fotografi & videografi profesional yang paling sesuai dengan budget dan skala acara Anda secara otomatis.";

    const getImageUrl = (path, fallback) => {
        if (!path) return fallback;
        if (path.startsWith("http://") || path.startsWith("https://")) return path;
        return `/storage/${path}`;
    };

    const image1 = getImageUrl(data?.image_path_1, "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600");
    const image2 = getImageUrl(data?.image_path_2, "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600");
    const image3 = getImageUrl(data?.image_path_3, "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600");
    const image4 = getImageUrl(data?.image_path_4, "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600");

    return (
        <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-brand-light/20 pt-6 pb-12 lg:pt-16 lg:pb-32">
            {/* Visual background decorations */}
            <div className="absolute top-1/4 left-10 w-72 h-72 bg-brand-light/30 rounded-full blur-3xl opacity-60 animate-float"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: "2s" }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                    {/* Left Column: Heading and Taglines */}
                    <div className="lg:col-span-7 space-y-5 lg:space-y-8 text-center lg:text-left animate-slide-up">
                        {/* Promo Badge */}
                        <div className="inline-flex items-center gap-2 bg-brand-light/40 border border-brand-accent/30 px-3 py-1.5 rounded-full text-brand-dark text-xs font-semibold shadow-sm backdrop-blur-sm">
                            <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse flex-shrink-0" />
                            <span>Rekomendasi Paket Instan & Akurat</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-deep leading-[1.15]">
                            {title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            {subtitle}
                        </p>

                        {/* CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
                            <button
                                onClick={scrollToWidget}
                                className="bg-brand-primary hover:bg-brand-dark text-white font-semibold px-6 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 flex items-center justify-center gap-2 cursor-pointer group text-sm"
                            >
                                Cari Paket Anda
                                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            </button>
                            <button
                                onClick={() => document.getElementById("alur-kerja")?.scrollIntoView({ behavior: "smooth" })}
                                className="bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-full border border-slate-200 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
                            >
                                Lihat Alur Booking
                                <Calendar className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-100 max-w-lg mx-auto lg:mx-0">
                            <div>
                                <h3 className="text-xl sm:text-3xl font-bold text-brand-deep">500+</h3>
                                <p className="text-2xs sm:text-sm text-slate-500 font-medium">Klien Puas</p>
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-3xl font-bold text-brand-deep">4</h3>
                                <p className="text-2xs sm:text-sm text-slate-500 font-medium">Paket Pilihan</p>
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-3xl font-bold text-brand-deep">99.8%</h3>
                                <p className="text-2xs sm:text-sm text-slate-500 font-medium">Tingkat Kepuasan</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Premium Collage Frame — hide on mobile */}
                    <div className="hidden lg:block lg:col-span-5 relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        <div className="relative mx-auto max-w-md lg:max-w-none">
                            {/* Decorative background outline */}
                            <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-light to-brand-accent rounded-3xl blur-md opacity-30"></div>
                            
                            {/* Main Frame Wrapper */}
                            <div className="relative bg-white p-3 rounded-3xl shadow-2xl border border-slate-100">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-3">
                                        <div className="rounded-2xl overflow-hidden shadow-sm h-48 bg-slate-100">
                                            <img
                                                src={image1}
                                                alt="Wedding Couple Shoot"
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="rounded-2xl overflow-hidden shadow-sm h-64 bg-slate-100">
                                            <img
                                                src={image3}
                                                alt="Graduation Celebration"
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 pt-6">
                                        <div className="rounded-2xl overflow-hidden shadow-sm h-64 bg-slate-100">
                                            <img
                                                src={image2}
                                                alt="Family Studio Portrait"
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="rounded-2xl overflow-hidden shadow-sm h-48 bg-slate-100">
                                            <img
                                                src={image4}
                                                alt="Pre-wedding Shoot"
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Micro Floating Badge */}
                            <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3 animate-float">
                                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Rekomendasi Instan</p>
                                    <p className="text-sm font-bold text-slate-800">Sistem Rekomendasi Pintar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Scroll Indicator */}
                <div className="hidden lg:flex justify-center mt-16">
                    <button
                        onClick={scrollToWidget}
                        className="text-slate-400 hover:text-brand-primary flex flex-col items-center gap-2 cursor-pointer group transition-colors"
                    >
                        <span className="text-xs font-semibold uppercase tracking-widest">Temukan Lebih Lanjut</span>
                        <ArrowDown className="w-4 h-4 animate-bounce group-hover:translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
