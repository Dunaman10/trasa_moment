import React, { useState } from "react";
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight, Clock, Check, Info, ChevronDown } from "lucide-react";

// Package definition fallback
const PACKAGES = [
    { id: "bronze", name: "Bronze Package", price: "Rp 1.250.000", desc: "Layanan hemat untuk foto individu studio, wisuda, pasfoto formal, atau portrait portofolio profesional." },
    { id: "silver", name: "Silver Package", price: "Rp 2.750.000", desc: "Dokumentasi hangat untuk pre-wedding outdoor romantis, acara tunangan (engagement), atau ulang tahun keluarga." },
    { id: "gold", name: "Gold Package", price: "Rp 4.900.000", desc: "Rekomendasi utama untuk liputan pernikahan (wedding day) tradisional maupun modern berskala sedang secara menyeluruh." },
    { id: "platinum", name: "Platinum Package", price: "Rp 8.500.000", desc: "Layanan VIP termewah untuk hari pernikahan akbar. Menawarkan liputan multi-angle cinematic dan dokumentasi udara." }
];

// Slot-level booking database (June & July 2026)
const MOCK_SLOT_STATUS = {
    "2026-06-18": { pagi: "booked", siang: "booked", sore: "booked" },
    "2026-06-19": { pagi: "available", siang: "available", sore: "available" },
    "2026-06-20": { pagi: "booked", siang: "available", sore: "hold" },
    "2026-06-21": { pagi: "available", siang: "booked", sore: "booked" },
    "2026-06-22": { pagi: "available", siang: "available", sore: "available" },
    "2026-06-23": { pagi: "hold", siang: "available", sore: "available" },
    "2026-06-24": { pagi: "available", siang: "available", sore: "available" },
    "2026-06-25": { pagi: "available", siang: "available", sore: "available" },
    "2026-06-26": { pagi: "available", siang: "hold", sore: "available" },
    "2026-06-27": { pagi: "booked", siang: "booked", sore: "booked" },
    "2026-06-28": { pagi: "booked", siang: "booked", sore: "booked" },
    "2026-06-29": { pagi: "available", siang: "available", sore: "available" },
    "2026-06-30": { pagi: "available", siang: "available", sore: "available" },
    "2026-07-01": { pagi: "available", siang: "available", sore: "available" },
    "2026-07-02": { pagi: "available", siang: "available", sore: "available" },
    "2026-07-03": { pagi: "available", siang: "hold", sore: "available" },
    "2026-07-04": { pagi: "booked", siang: "booked", sore: "booked" },
    "2026-07-05": { pagi: "booked", siang: "booked", sore: "booked" },
    "2026-07-06": { pagi: "available", siang: "available", sore: "available" },
    "2026-07-07": { pagi: "available", siang: "available", sore: "available" },
    "2026-07-08": { pagi: "available", siang: "available", sore: "available" },
    "2026-07-09": { pagi: "available", siang: "available", sore: "available" },
    "2026-07-10": { pagi: "available", siang: "hold", sore: "available" },
    "2026-07-11": { pagi: "booked", siang: "booked", sore: "booked" },
    "2026-07-12": { pagi: "booked", siang: "booked", sore: "booked" },
    "2026-07-15": { pagi: "available", siang: "available", sore: "available" },
    "2026-07-18": { pagi: "booked", siang: "booked", sore: "booked" },
    "2026-07-19": { pagi: "booked", siang: "booked", sore: "booked" },
};

const TIME_SLOTS = [
    { id: "pagi", time: "09:00 - 12:00", label: "Sesi Pagi", sublabel: "Outdoor / Indoor" },
    { id: "siang", time: "13:00 - 16:00", label: "Sesi Siang", sublabel: "Golden Hour / Indoor" },
    { id: "sore", time: "17:00 - 20:00", label: "Sesi Sore/Malam", sublabel: "Night Shoot / Event" }
];

export default function CalendarPage({ selectedPackage, packages, onBack, onProceed }) {
    const todayDate = new Date();
    const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
    const [selectedDateStr, setSelectedDateStr] = useState("");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [apiSlotStatus, setApiSlotStatus] = useState({});

    React.useEffect(() => {
        fetch(`/api/calendar/availability?year=${currentYear}&month=${currentMonth + 1}`)
            .then(res => res.json())
            .then(data => {
                const compiled = {};
                if (data.blocks) {
                    data.blocks.forEach(block => {
                        compiled[block.date] = { 
                            pagi: "booked", 
                            siang: "booked", 
                            sore: "booked",
                            isBlocked: true,
                            reason: block.title || "Libur Studio"
                        };
                    });
                }
                if (data.bookings) {
                    data.bookings.forEach(b => {
                        if (!compiled[b.date]) {
                            compiled[b.date] = { pagi: "available", siang: "available", sore: "available" };
                        }
                        const statusMapping = b.status === "awaiting_payment" || b.status === "awaiting_verification" ? "hold" : "booked";
                        compiled[b.date][b.session] = statusMapping;
                    });
                }
                setApiSlotStatus(compiled);
            })
            .catch(err => {
                console.error("Failed to load availability", err);
            });
    }, [currentYear, currentMonth]);

    const initialPkg = selectedPackage || (packages && packages[0]) || PACKAGES[2];
    const [activePackage, setActivePackage] = useState(initialPkg);

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(p => p - 1); }
        else setCurrentMonth(p => p - 1);
    };
    const handleNextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(p => p + 1); }
        else setCurrentMonth(p => p + 1);
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const calendarGrid = [];
    for (let i = 0; i < firstDay; i++) calendarGrid.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarGrid.push(d);

    const formatDateString = (day) => {
        if (!day) return "";
        const m = String(currentMonth + 1).padStart(2, "0");
        const d = String(day).padStart(2, "0");
        return `${currentYear}-${m}-${d}`;
    };

    const isPastDate = (day) => {
        if (!day) return false;
        const targetDateObj = new Date(currentYear, currentMonth, day, 0, 0, 0, 0);
        const currentDateObj = new Date();
        currentDateObj.setHours(0, 0, 0, 0);
        return targetDateObj < currentDateObj;
    };

    const getDayAvailabilityStatus = (dateStr) => {
        const slots = apiSlotStatus[dateStr];
        if (slots?.isBlocked) return "blocked";
        if (!slots) return "available";
        const values = Object.values(slots).filter(v => typeof v === "string");
        if (values.every(v => v === "booked")) return "booked";
        if (values.some(v => v === "booked" || v === "hold")) return "hold";
        return "available";
    };

    const handleSelectDay = (day) => {
        if (isPastDate(day)) return;
        const dateStr = formatDateString(day);
        const status = getDayAvailabilityStatus(dateStr);
        if (status === "booked") return;
        setSelectedDateStr(dateStr);
        setSelectedTimeSlot("");
        // Auto-scroll to time slot section on mobile
        setTimeout(() => {
            document.getElementById("slot-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
    };

    const handleProceedToCheckout = () => {
        if (!selectedDateStr) { alert("Silakan pilih tanggal di kalender terlebih dahulu."); return; }
        if (!selectedTimeSlot) { alert("Silakan pilih slot waktu sesi foto terlebih dahulu."); return; }
        onProceed(activePackage, selectedDateStr, selectedTimeSlot);
    };

    const handlePackageChange = (e) => {
        const pkgList = packages || PACKAGES;
        const pkg = pkgList.find(p => String(p.id) === String(e.target.value)) || pkgList[2];
        setActivePackage(pkg);
    };

    const getFormattedDisplayDate = (dateStr) => {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split("-");
        const dow = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
        const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
        return `${dow[dateObj.getDay()]}, ${d} ${months[dateObj.getMonth()]} ${y}`;
    };

    const canProceed = selectedDateStr && selectedTimeSlot;

    return (
        <div className="min-h-screen bg-slate-50 pb-28 lg:pb-10">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 sticky top-[57px] z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-brand-primary font-semibold text-sm transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Kembali</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-brand-deep font-bold">
                        <CalendarIcon className="w-4 h-4 text-brand-primary" />
                        <span className="text-[10px] sm:text-xs uppercase tracking-wide">Langkah 2: Pilih Jadwal</span>
                    </div>
                    {/* Package pill on header for mobile - hidden on sm and below to prevent clutter */}
                    <div className="hidden sm:flex items-center gap-1 bg-brand-primary/10 px-2.5 py-1 rounded-full">
                        <span className="text-2xs font-extrabold text-brand-primary truncate max-w-[90px]">{(activePackage?.name || "").split(" ")[0]}</span>
                        <span className="text-2xs font-bold text-brand-primary/70">{activePackage.formatted_price || activePackage.price}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5">
                {/* Package switcher - compact on mobile */}
                <div className="mb-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
                    <div className="flex-shrink-0 bg-brand-primary/10 p-2 rounded-xl">
                        <CalendarIcon className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-2xs text-slate-400 font-bold uppercase tracking-wide">Paket Dipilih</p>
                        <p className="text-xs font-extrabold text-brand-deep truncate">{activePackage.name} — {activePackage.formatted_price || activePackage.price}</p>
                    </div>
                    <div className="relative flex-shrink-0">
                        <select
                            value={activePackage.id}
                            onChange={handlePackageChange}
                            className="appearance-none bg-slate-100 border border-slate-200 text-slate-700 rounded-xl pl-3 pr-7 py-1.5 text-xs font-bold focus:outline-none cursor-pointer"
                        >
                            {(packages && packages.length > 0 ? packages : PACKAGES).map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Main layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">

                    {/* Calendar Card */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-slate-100/50 overflow-hidden">
                        {/* Calendar header - column on mobile, row on larger screens */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3.5 border-b border-slate-100 gap-3">
                            <div>
                                <h2 className="text-sm sm:text-base font-bold text-brand-deep">Kalender Ketersediaan</h2>
                                <p className="text-2xs text-slate-400">Pilih tanggal sesi foto yang tersedia</p>
                            </div>
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-2 py-1 self-start sm:self-auto">
                                <button onClick={handlePrevMonth} className="p-1.5 text-slate-600 hover:text-brand-primary cursor-pointer rounded-full hover:bg-white transition-all">
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                                <span className="font-extrabold text-xs text-brand-deep min-w-[90px] text-center select-none">
                                    {months[currentMonth]} {currentYear}
                                </span>
                                <button onClick={handleNextMonth} className="p-1.5 text-slate-600 hover:text-brand-primary cursor-pointer rounded-full hover:bg-white transition-all">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Legend — compact horizontal strip */}
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0"></div>
                                <span className="text-2xs font-semibold text-slate-500">Tersedia</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                                <span className="text-2xs font-semibold text-slate-500">Sebagian Terisi</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full flex-shrink-0"></div>
                                <span className="text-2xs font-semibold text-slate-500">Penuh</span>
                            </div>
                        </div>

                        <div className="p-3 sm:p-5">
                            {/* Days header */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {daysOfWeek.map(d => (
                                    <div key={d} className="text-center text-2xs font-bold text-slate-400 py-1">{d}</div>
                                ))}
                            </div>

                            {/* Calendar grid — larger touch targets */}
                            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                                {calendarGrid.map((day, idx) => {
                                    if (day === null) {
                                        return <div key={`empty-${idx}`} className="aspect-square" />;
                                    }

                                    const dateStr = formatDateString(day);
                                    const past = isPastDate(day);
                                    const status = past ? "booked" : getDayAvailabilityStatus(dateStr);
                                    const isSelected = selectedDateStr === dateStr;

                                    let cellClass = "bg-white border border-slate-200 text-slate-800 cursor-pointer active:scale-95";
                                    let dotColor = "bg-emerald-500";

                                    if (past) {
                                        cellClass = "bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed opacity-40";
                                        dotColor = "bg-slate-200";
                                    } else if (status === "blocked") {
                                        cellClass = "bg-rose-50 border border-rose-200 text-rose-700 cursor-pointer active:scale-95";
                                        dotColor = "bg-rose-500";
                                    } else if (status === "booked") {
                                        cellClass = "bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed";
                                        dotColor = "bg-slate-300";
                                    } else if (status === "hold") {
                                        cellClass = "bg-amber-50 border border-amber-200 text-slate-700 cursor-pointer active:scale-95";
                                        dotColor = "bg-amber-500";
                                    }

                                    if (isSelected && !past) {
                                        if (status === "blocked") {
                                            cellClass = "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105 cursor-pointer";
                                            dotColor = "bg-white";
                                        } else {
                                            cellClass = "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105 cursor-pointer";
                                            dotColor = "bg-white";
                                        }
                                    }

                                    return (
                                        <div
                                            key={`day-${day}`}
                                            onClick={() => !past && handleSelectDay(day)}
                                            className={`aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-200 select-none relative ${cellClass}`}
                                        >
                                            <span className="text-xs sm:text-sm font-bold leading-none">{day}</span>
                                            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${dotColor}`} />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Info note */}
                            <div className="mt-4 bg-brand-light/10 border border-brand-accent/20 rounded-xl p-3 flex gap-2 text-2xs leading-relaxed text-brand-dark/90">
                                <Info className="w-4 h-4 text-brand-dark flex-shrink-0 mt-0.5" />
                                <p>Slot terisi otomatis diblokir. Jika Anda memilih slot yang tersedia, jadwal dijamin tidak bentrok dengan klien lain.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right panel: time slots */}
                    <div id="slot-section" className="lg:col-span-4 space-y-4">

                        {/* Time Slots */}
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-100/50 overflow-hidden">
                            <div className="px-4 py-3.5 border-b border-slate-100">
                                <h3 className="font-bold text-brand-deep text-sm">Pilih Slot Waktu</h3>
                                <p className="text-2xs text-slate-400">
                                    {selectedDateStr ? `Tanggal: ${getFormattedDisplayDate(selectedDateStr)}` : "Pilih tanggal di kalender terlebih dahulu"}
                                </p>
                            </div>

                            <div className="p-3 sm:p-4">
                                {selectedDateStr ? (
                                    apiSlotStatus[selectedDateStr]?.isBlocked ? (
                                        <div className="py-6 px-4 text-center bg-rose-50 border border-rose-100 rounded-2xl space-y-3">
                                            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                                                <Info className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-extrabold text-sm text-rose-800">Tanggal Ini Ditutup (Libur/Penuh)</h4>
                                            <p className="text-xs text-rose-700 leading-relaxed font-bold">
                                                Alasan: {apiSlotStatus[selectedDateStr]?.reason || "Libur Studio"}
                                            </p>
                                            <p className="text-3xs text-slate-400">Silakan pilih tanggal lain yang berwarna hijau pada kalender.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2.5">
                                            {TIME_SLOTS.map((slot) => {
                                                const dateSlots = apiSlotStatus[selectedDateStr] || { pagi: "available", siang: "available", sore: "available" };
                                                const slotStatus = dateSlots[slot.id] || "available";
                                                const isSelected = selectedTimeSlot === slot.id;
                                                const isBooked = slotStatus === "booked";
                                                const isHold = slotStatus === "hold";
                                                
                                                // Check if the selected date is today and slot time has passed
                                                const today = new Date();
                                                const isDateToday = (() => {
                                                    if (!selectedDateStr) return false;
                                                    const [y, m, d] = selectedDateStr.split("-");
                                                    return today.getFullYear() === Number(y) &&
                                                           (today.getMonth() + 1) === Number(m) &&
                                                           today.getDate() === Number(d);
                                                })();
                                                
                                                const isPastTimeSlot = (() => {
                                                    if (!isDateToday) return false;
                                                    const currentHour = today.getHours();
                                                    const currentMinute = today.getMinutes();
                                                    const currentTimeMinutes = currentHour * 60 + currentMinute;
                                                    
                                                    // Start times cut-off: pagi = 09:00 (540m), siang = 13:00 (780m), sore = 17:00 (1020m)
                                                    const startMinutes = {
                                                        pagi: 9 * 60,
                                                        siang: 13 * 60,
                                                        sore: 17 * 60
                                                    }[slot.id] || 0;
                                                    
                                                    return currentTimeMinutes >= startMinutes;
                                                })();
                                                
                                                const isDisabled = isBooked || isHold || isPastTimeSlot;

                                                let borderClass = "border-slate-100 hover:border-brand-primary/40 cursor-pointer active:scale-[0.98]";
                                                let statusText = "Tersedia";
                                                let statusColor = "text-emerald-600 bg-emerald-50";

                                                if (isBooked) {
                                                    borderClass = "border-slate-100 bg-slate-50 cursor-not-allowed opacity-50";
                                                    statusText = "Penuh";
                                                    statusColor = "text-slate-400 bg-slate-100";
                                                } else if (isHold) {
                                                    borderClass = "border-amber-100 bg-amber-50/50 cursor-not-allowed opacity-60";
                                                    statusText = "Hold";
                                                    statusColor = "text-amber-600 bg-amber-50";
                                                } else if (isPastTimeSlot) {
                                                    borderClass = "border-slate-100 bg-slate-50 cursor-not-allowed opacity-40";
                                                    statusText = "Sudah Lewat";
                                                    statusColor = "text-rose-600 bg-rose-50";
                                                }

                                                if (isSelected) {
                                                    borderClass = "border-brand-primary bg-brand-primary/5 shadow-md cursor-pointer";
                                                }

                                                return (
                                                    <div
                                                        key={slot.id}
                                                        onClick={() => !isDisabled && setSelectedTimeSlot(slot.id)}
                                                        className={`flex items-center justify-between p-3.5 border-2 rounded-2xl transition-all duration-200 ${borderClass}`}
                                                    >
                                                        <div className="space-y-0.5">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h4 className={`text-xs font-bold ${isSelected ? "text-brand-primary" : "text-slate-800"}`}>
                                                                    {slot.label}
                                                                </h4>
                                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${statusColor}`}>
                                                                    {statusText}
                                                                </span>
                                                            </div>
                                                            <span className="text-2xs text-slate-400 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {slot.time} · {slot.sublabel}
                                                            </span>
                                                        </div>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                                            isSelected ? "border-brand-primary bg-brand-primary text-white" : "border-slate-200"
                                                        }`}>
                                                            {isSelected && <Check className="w-3 h-3" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                ) : (
                                    <div className="py-10 text-center flex flex-col items-center gap-3">
                                        <CalendarIcon className="w-10 h-10 text-slate-200 animate-pulse" />
                                        <p className="text-xs text-slate-400 font-semibold max-w-[180px]">Pilih tanggal di kalender untuk melihat slot kosong</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Desktop proceed button */}
                        <button
                            onClick={handleProceedToCheckout}
                            disabled={!canProceed}
                            className={`hidden lg:flex w-full py-4 rounded-full font-bold text-sm shadow-md transition-all duration-300 items-center justify-center gap-2 cursor-pointer ${
                                canProceed
                                    ? "bg-brand-primary text-white hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-primary/20"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                            }`}
                        >
                            Lanjutkan ke Checkout
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile sticky bottom CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-3 shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="flex-grow min-w-0">
                        {canProceed ? (
                            <div>
                                <p className="text-2xs text-slate-400 font-semibold truncate">{getFormattedDisplayDate(selectedDateStr)}</p>
                                <p className="text-xs font-bold text-brand-deep truncate">
                                    {TIME_SLOTS.find(s => s.id === selectedTimeSlot)?.label} · {activePackage.price}
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 font-semibold">
                                {!selectedDateStr ? "Pilih tanggal dulu" : "Pilih slot waktu"}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleProceedToCheckout}
                        disabled={!canProceed}
                        className={`flex-shrink-0 py-3 px-6 rounded-full font-bold text-sm shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                            canProceed
                                ? "bg-brand-primary text-white active:bg-brand-dark"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        Lanjutkan
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
