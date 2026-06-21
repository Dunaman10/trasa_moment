import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import logoUrl from "../../assets/img/logo-trasa-moment.png";

export default function Navbar({ onNavigate, currentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (targetPage, id) => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(targetPage, id);
    } else {
      // Fallback for scrolling
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled || currentPage !== "landing"
            ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100/50 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              className="flex items-center space-x-2.5 cursor-pointer z-50 animate-fade-in"
              onClick={() => handleNavClick("landing", "hero")}
            >
              <img
                src={logoUrl}
                alt="Trasa Moment Logo"
                className="w-10 h-10 rounded-full object-cover border border-slate-200/60 shadow-sm"
              />
              <span className="text-xl font-bold tracking-tight text-brand-deep">
                Trasa<span className="text-brand-primary">Moment</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {[
                { name: "Beranda", type: "section", target: "hero" },
                { name: "Rekomendasi", type: "section", target: "rekomendasi" },
                { name: "Layanan", type: "section", target: "layanan" },
                { name: "Alur Kerja", type: "section", target: "alur-kerja" },
                { name: "Portfolio", type: "section", target: "portfolio" },
                { name: "Jadwal Kalender", type: "page", target: "calendar" },
                { name: "Lacak Order", type: "page", target: "tracking" },
              ].map((item) => {
                const isActivePage = currentPage === item.target;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (item.type === "page") {
                        handleNavClick(item.target);
                      } else {
                        handleNavClick("landing", item.target);
                      }
                    }}
                    className={`font-medium text-xs transition-colors cursor-pointer ${
                      isActivePage
                        ? "text-brand-primary font-bold border-b-2 border-brand-primary pb-1"
                        : "text-slate-600 hover:text-brand-primary"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => handleNavClick("landing", "rekomendasi")}
                className="bg-brand-primary hover:bg-brand-dark text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-brand-primary/10 hover:shadow-brand-primary/20 flex items-center gap-1.5 cursor-pointer"
              >
                Pesan Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-3 rounded-2xl text-slate-700 hover:text-brand-primary hover:bg-slate-50 focus:outline-none transition-all duration-300"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white md:hidden flex flex-col items-center justify-center z-45 transition-all duration-500 ease-in-out transform ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md px-6">
          {[
            { name: "Beranda", type: "section", target: "hero" },
            {
              name: "Rekomendasi Paket",
              type: "section",
              target: "rekomendasi",
            },
            { name: "Layanan & Harga", type: "section", target: "layanan" },
            { name: "Alur Booking", type: "section", target: "alur-kerja" },
            { name: "Portfolio Gallery", type: "section", target: "portfolio" },
            { name: "Jadwal Kalender", type: "page", target: "calendar" },
            { name: "Lacak Status Order", type: "page", target: "tracking" },
          ].map((item, idx) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.type === "page") {
                  handleNavClick(item.target);
                } else {
                  handleNavClick("landing", item.target);
                }
              }}
              className={`text-slate-800 hover:text-brand-primary text-xl font-extrabold transition-all duration-300 transform cursor-pointer ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{
                transitionDelay: `${idx * 50}ms`,
                transitionProperty: "transform, opacity, color",
              }}
            >
              {item.name}
            </button>
          ))}
          <div
            className={`w-full pt-6 border-t border-slate-100 transition-all duration-500 transform ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{
              transitionDelay: "350ms",
              transitionProperty: "transform, opacity",
            }}
          >
            <button
              onClick={() => handleNavClick("landing", "rekomendasi")}
              className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold text-center py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              Pesan Sekarang
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
