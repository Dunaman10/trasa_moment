import React from "react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
    {
        name: "Rian & Sarah",
        role: "Klien Wedding (Gold Package)",
        quote: "Sistem rekomendasi paketnya sangat membantu! Awalnya bingung pilih paket untuk pernikahan intim kami di taman. Sliders sangat presisi dan hasilnya benar-benar luar biasa. Kru foto sangat sopan dan profesional.",
        stars: 5,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    },
    {
        name: "Fadel Rahman",
        role: "Wisudawan Universitas (Bronze Package)",
        quote: "Checkout sebagai guest sangat mempermudah pemesanan slot pas foto wisuda tanpa harus pusing bikin akun. Pelacakan pesanan menggunakan kode TRASA juga transparan sekali, kita tahu progres editing sampai foto siap unduh.",
        stars: 5,
        avatar: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=150"
    },
    {
        name: "Citra Kirana",
        role: "Klien Pre-wedding (Silver Package)",
        quote: "Terima kasih Trasa Moment! Layanan dari sebelum hari H sampai penyerahan file sangat memuaskan. Album photobook cetak yang dikirim eksklusif sekali. Worth it dengan investasi yang kami keluarkan.",
        stars: 5,
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150"
    }
];

export default function Testimonials({ testimonials }) {
    const displayList = testimonials && testimonials.length > 0 ? testimonials.map((t, idx) => ({
        name: t.client_name,
        role: `Klien ${t.event_category || 'Event'}`,
        quote: t.review_text,
        stars: t.rating || 5,
        avatar: t.client_avatar_path || t.avatar,
    })) : TESTIMONIALS;

    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-brand-light/30 px-4 py-1.5 rounded-full">
                        Testimoni Klien
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-deep">
                        Kata Mereka Tentang Trasa Moment
                    </h2>
                    <p className="text-slate-500 text-base sm:text-lg">
                        Ulasan tulus dari para pelanggan yang telah mempercayakan dokumentasi momen berharga mereka kepada kami.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {displayList.map((testi, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="space-y-6">
                                {/* Stars & Quote Icon */}
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1 text-yellow-400">
                                        {[...Array(testi.stars)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <Quote className="w-8 h-8 text-brand-light/40" />
                                </div>

                                {/* Text */}
                                <p className="text-sm text-slate-600 leading-relaxed italic">
                                    "{testi.quote}"
                                </p>
                            </div>

                            {/* Author Info */}
                            <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-6">
                                <img
                                    src={testi.avatar}
                                    alt={testi.name}
                                    className="w-12 h-12 rounded-full object-cover shadow-sm bg-slate-50"
                                />
                                <div>
                                    <h4 className="font-extrabold text-brand-deep text-sm">
                                        {testi.name}
                                    </h4>
                                    <p className="text-3xs text-slate-400 font-semibold tracking-wide uppercase">
                                        {testi.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
