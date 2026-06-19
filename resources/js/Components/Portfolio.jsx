import React, { useState } from "react";
import { Grid, Eye } from "lucide-react";

const PORTFOLIO_ITEMS = [
    {
        id: 1,
        title: "Classic Traditional Wedding",
        category: "wedding",
        img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "Vibrant Outdoor Graduation",
        category: "graduation",
        img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Modern Cinematic Pre-wedding",
        category: "wedding",
        img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        title: "Minimalist Fine Art Portrait",
        category: "personal",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 5,
        title: "Corporate Seminar & Event",
        category: "event",
        img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 6,
        title: "Studio Family Session",
        category: "personal",
        img: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 7,
        title: "Rustic Garden Engagement",
        category: "wedding",
        img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 8,
        title: "Studio Modeling Portfolio",
        category: "personal",
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
    }
];

export default function Portfolio({ items }) {
    const [filter, setFilter] = useState("all");
    const [hoveredItem, setHoveredItem] = useState(null);

    const portfolioList = items && items.length > 0 ? items.map((item, idx) => ({
        id: item.id || idx,
        title: item.title,
        category: item.category,
        img: item.image_path || item.img,
    })) : PORTFOLIO_ITEMS;

    const filteredItems = filter === "all" 
        ? portfolioList 
        : portfolioList.filter(item => item.category === filter);

    return (
        <section id="portfolio" className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-brand-light/30 px-4 py-1.5 rounded-full">
                        Hasil Karya Kami
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-deep">
                        Portfolio Pilihan Trasa Moment
                    </h2>
                    <p className="text-slate-500 text-base sm:text-lg">
                        Lihat kumpulan cuplikan foto terbaik kami dari berbagai kategori acara.
                    </p>
                </div>

                {/* Filter Tags */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {[
                        { name: "Semua Karya", key: "all" },
                        { name: "Pernikahan (Wedding)", key: "wedding" },
                        { name: "Wisuda (Graduation)", key: "graduation" },
                        { name: "Sesi Personal", key: "personal" },
                        { name: "Acara (Event)", key: "event" }
                    ].map((btn) => (
                        <button
                            key={btn.key}
                            onClick={() => setFilter(btn.key)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                                filter === btn.key
                                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/10"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50"
                            }`}
                        >
                            {btn.name}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="relative overflow-hidden rounded-3xl group shadow-md hover:shadow-2xl transition-all duration-500 aspect-[4/3] bg-slate-100"
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            {/* Image */}
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                            />

                            {/* Hover Overlay */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-t from-brand-deep/95 via-brand-dark/40 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300 ${
                                    hoveredItem === item.id ? "opacity-100" : "opacity-0 pointer-events-none"
                                }`}
                            >
                                <div className="space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-3xs uppercase tracking-widest text-brand-light font-bold">
                                        {item.category}
                                    </span>
                                    <h4 className="text-sm font-bold text-white leading-snug">
                                        {item.title}
                                    </h4>
                                    <div className="inline-flex items-center gap-1.5 text-2xs text-slate-300 font-semibold cursor-pointer hover:text-white pt-2">
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Lihat Detail</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
