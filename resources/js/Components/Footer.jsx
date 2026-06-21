import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import logoUrl from "../../assets/img/logo-trasa-moment.png";

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Terima kasih telah berlangganan newsletter Trasa Moment!");
  };

  return (
    <footer className="bg-brand-deep text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-2.5 text-white">
              <img
                src={logoUrl}
                alt="Trasa Moment Logo"
                className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm"
              />
              <span className="text-xl font-bold tracking-tight">
                Trasa<span className="text-brand-light">Moment</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Platform penyedia layanan dokumentasi fotografi & videografi
              premium yang membantu Anda mengabadikan setiap momen emas
              kehidupan secara profesional dan transparan.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Instagram"
                className="p-2 bg-slate-800 hover:bg-brand-primary text-slate-400 hover:text-white rounded-xl transition-all duration-300"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 bg-slate-800 hover:bg-brand-primary text-slate-400 hover:text-white rounded-xl transition-all duration-300"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="p-2 bg-slate-800 hover:bg-brand-primary text-slate-400 hover:text-white rounded-xl transition-all duration-300"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                  <polygon points="10 15 15 12 10 9" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-widest uppercase">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                "Beranda",
                "Rekomendasi Paket",
                "Katalog Layanan",
                "Alur Kerja",
                "Portfolio Karya",
              ].map((item, idx) => {
                const ids = [
                  "hero",
                  "rekomendasi",
                  "layanan",
                  "alur-kerja",
                  "portfolio",
                ];
                return (
                  <li key={idx}>
                    <a
                      href={`#${ids[idx]}`}
                      className="hover:text-brand-light transition-colors text-slate-400"
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact details */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-widest uppercase">
              Hubungi Kami
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-light flex-shrink-0 mt-0.5" />
                <span>
                  Jl. Moment Emas No. 45, Kebayoran Baru, Jakarta Selatan, 12130
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-light flex-shrink-0" />
                <span>+62 812-3456-7890 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-light flex-shrink-0" />
                <span>halo@trasamoment.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-widest uppercase">
              Newsletter
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dapatkan promo paket foto menarik dan tips dokumentasi acara
              langsung ke email Anda.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                required
                placeholder="Alamat email Anda"
                className="bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary placeholder-slate-500"
              />
              <button
                type="submit"
                className="bg-brand-primary hover:bg-brand-light hover:text-brand-deep text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-300 cursor-pointer text-center"
              >
                Berlangganan
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-2xs text-slate-500 font-medium">
          <p>
            © {new Date().getFullYear()} Trasa Moment Booking System. Hak Cipta
            Dilindungi.
          </p>
          <p className="mt-2 sm:mt-0">
            Built for{" "}
            <span className="text-slate-400">Trasa Moment Agency</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
