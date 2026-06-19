import React from "react";
import { Sliders, CalendarRange, UserCheck, FileImage, Download } from "lucide-react";

const STEPS = [
    {
        num: "01",
        icon: Sliders,
        title: "Rekomendasi Pintar",
        desc: "Geser parameter anggaran, durasi, dan skala acara. Sistem menghitung rekomendasi paket yang paling pas otomatis."
    },
    {
        num: "02",
        icon: CalendarRange,
        title: "Cek Jadwal Publik",
        desc: "Lihat kalender publik untuk mengecek slot hari kosong. Tidak perlu takut bentrok dengan pesanan klien lain."
    },
    {
        num: "03",
        icon: UserCheck,
        title: "Guest Checkout",
        desc: "Pesan instan tanpa kewajiban membuat akun. Cukup isi detail lokasi, kontak, dan info acara Anda."
    },
    {
        num: "04",
        icon: FileImage,
        title: "Bayar DP & Upload",
        desc: "Amankan slot tanggal dengan mentransfer DP manual, lalu unggah bukti transfer. Batas bayar 60 menit."
    },
    {
        num: "05",
        icon: Download,
        title: "Lacak & Unduh Hasil",
        desc: "Gunakan kode booking unik (misal: TRASA-XYZ) di portal pelacakan untuk memantau status edit dan mengunduh foto."
    }
];

export default function HowItWorks() {
    return (
        <section id="alur-kerja" className="py-12 lg:py-20 bg-slate-50 relative overflow-hidden">
            {/* Visual Deco Line in Background */}
            <div className="hidden lg:block absolute top-[60%] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-light via-brand-primary to-brand-light z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-20 space-y-3">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-brand-light/30 px-4 py-1.5 rounded-full">
                        Alur Kerja Kami
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-deep">
                        Bagaimana Cara Memesan di Trasa Moment?
                    </h2>
                    <p className="text-slate-500 text-base sm:text-lg">
                        Proses pemesanan dirancang sesederhana mungkin untuk mengurangi friction pengguna melalui skema guest checkout.
                    </p>
                </div>

                {/* Steps Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 items-stretch">
                    {STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-slate-100 hover:border-brand-primary/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between items-center text-center group relative z-10"
                            >
                                <div className="space-y-4 flex flex-col items-center">
                                    {/* Number Bubble */}
                                    <span className="text-4xl font-black text-slate-100 group-hover:text-brand-light transition-colors leading-none">
                                        {step.num}
                                    </span>

                                    {/* Icon Box */}
                                    <div className="bg-brand-light/25 p-3 rounded-2xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    {/* Text Content */}
                                    <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-2xs text-slate-500 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
