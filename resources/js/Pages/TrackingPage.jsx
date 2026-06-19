import React, { useState, useEffect } from "react";
import { Search, FileText, CheckCircle2, Clock, Calendar, Check, Download, ExternalLink, HelpCircle, Copy as CopyIcon, Upload, X, AlertCircle } from "lucide-react";

// Mock booking database
const MOCK_BOOKING_DB = {
    "TRASA-XYZ123": {
        code: "TRASA-XYZ123",
        name: "Syarif Hidayatullah",
        package: "Gold (Standard Wedding / Big Event)",
        price: "Rp 4.900.000",
        date: "2026-06-25",
        slot: "siang",
        location: "Kuningan, Jakarta Selatan",
        status: "scheduled", // awaiting_payment, awaiting_verification, scheduled, shooting, editing, completed
        bank: "BCA",
        updatedAt: "2026-06-18 09:00"
    },
    "TRASA-COMPLETED": {
        code: "TRASA-COMPLETED",
        name: "Jessica Alvia",
        package: "Bronze (Personal / Grad)",
        price: "Rp 1.250.000",
        date: "2026-06-10",
        slot: "pagi",
        location: "Studio Trasa, Jakarta",
        status: "completed",
        bank: "Mandiri",
        updatedAt: "2026-06-12 15:30",
        downloadUrl: "https://drive.google.com/drive/folders/mock-trasa-moment-photos"
    }
};

export default function TrackingPage({ initialBookingCode, justCheckedOut, onBackToLanding }) {
    const [searchCode, setSearchCode] = useState(initialBookingCode || "");
    const [activeBooking, setActiveBooking] = useState(null);
    const [searchError, setSearchError] = useState("");
    const [copied, setCopied] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    // Re-upload states
    const [receiptDp, setReceiptDp] = useState(null);
    const [receiptDpPreview, setReceiptDpPreview] = useState("");
    const [receiptAdmin, setReceiptAdmin] = useState(null);
    const [receiptAdminPreview, setReceiptAdminPreview] = useState("");
    const [isReuploading, setIsReuploading] = useState(false);
    const [reuploadErrors, setReuploadErrors] = useState({});
    const [reuploadSuccess, setReuploadSuccess] = useState(false);

    const handleFileChangeDp = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Ukuran file maksimal adalah 5MB");
                return;
            }
            setReceiptDp(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptDpPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChangeAdmin = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Ukuran file maksimal adalah 5MB");
                return;
            }
            setReceiptAdmin(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptAdminPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFileDp = () => {
        setReceiptDp(null);
        setReceiptDpPreview("");
    };

    const handleRemoveFileAdmin = () => {
        setReceiptAdmin(null);
        setReceiptAdminPreview("");
    };

    const handleReuploadSubmit = (e) => {
        e.preventDefault();
        const errors = {};

        if (!receiptDp) errors.receiptDp = "Bukti transfer DP jasa fotografi wajib diunggah";
        if (!receiptAdmin) errors.receiptAdmin = "Bukti transfer biaya admin QRIS wajib diunggah";

        if (Object.keys(errors).length > 0) {
            setReuploadErrors(errors);
            return;
        }

        setReuploadErrors({});
        setIsReuploading(true);

        const formData = new FormData();
        formData.append("payment_proof_dp", receiptDp);
        formData.append("payment_proof_admin", receiptAdmin);

        fetch(`/api/tracking/${activeBooking.code}/reupload`, {
            method: "POST",
            body: formData,
        })
            .then(async (res) => {
                const data = await res.json();
                if (res.ok) {
                    setIsReuploading(false);
                    setReuploadSuccess(true);
                    // Refresh booking data
                    handleSearch(activeBooking.code);
                    // Clear files
                    setReceiptDp(null);
                    setReceiptDpPreview("");
                    setReceiptAdmin(null);
                    setReceiptAdminPreview("");
                } else {
                    setIsReuploading(false);
                    setReuploadErrors(data.errors || { general: data.message || "Terjadi kesalahan" });
                }
            })
            .catch((err) => {
                console.error("Reupload failed", err);
                setIsReuploading(false);
                setReuploadErrors({ general: "Gagal menghubungi server. Silakan coba lagi." });
            });
    };

    useEffect(() => {
        if (initialBookingCode) {
            handleSearch(initialBookingCode);
        }
    }, [initialBookingCode]);

    const handleSearch = (codeToSearch) => {
        const cleanCode = (codeToSearch || searchCode).trim().toUpperCase();
        if (!cleanCode) {
            setSearchError("Silakan masukkan Kode Booking terlebih dahulu");
            setActiveBooking(null);
            return;
        }

        setReuploadSuccess(false);
        setReuploadErrors({});

        fetch(`/api/tracking/${cleanCode}`)
            .then(async (res) => {
                const data = await res.json();
                if (res.ok) {
                    setActiveBooking({
                        code: data.booking_code,
                        name: data.customer_name,
                        package: data.package_name,
                        date: data.event_date,
                        slot: data.booking_session,
                        status: data.status,
                        downloadUrl: data.final_drive_link,
                        updatedAt: new Date(data.created_at).toLocaleString("id-ID"),
                    });
                    setSearchError("");
                } else {
                    setSearchError(data.message || "Kode booking tidak ditemukan.");
                    setActiveBooking(null);
                }
            })
            .catch((err) => {
                console.error("Tracking lookup failed", err);
                if (MOCK_BOOKING_DB[cleanCode]) {
                    setActiveBooking(MOCK_BOOKING_DB[cleanCode]);
                    setSearchError("");
                } else if (cleanCode.startsWith("TRASA-") && cleanCode.length >= 10) {
                    setActiveBooking({
                        code: cleanCode,
                        name: "Pelanggan Terhormat (Guest)",
                        package: "Silver (Intimate Event / Pre-wedding)",
                        price: "Rp 2.750.000",
                        date: "2026-06-22",
                        slot: "siang",
                        location: "Lokasi Acara Pilihan",
                        status: "awaiting_verification",
                        bank: "BCA",
                        updatedAt: new Date().toLocaleString("id-ID"),
                    });
                    setSearchError("");
                } else {
                    setSearchError("Kode booking tidak valid atau tidak ditemukan");
                    setActiveBooking(null);
                }
            });
    };

    const copyToClipboard = (text) => {
        // Method 1: Modern Clipboard API (secure contexts: HTTPS or localhost)
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            navigator.clipboard.writeText(text)
                .then(() => showCopySuccess())
                .catch(() => fallbackCopy(text));
            return;
        }
        // Method 2: execCommand fallback (works on HTTP)
        fallbackCopy(text);
    };

    const fallbackCopy = (text) => {
        try {
            const el = document.createElement("textarea");
            el.value = text;
            el.setAttribute("readonly", "");
            el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;";
            document.body.appendChild(el);
            el.focus();
            el.select();
            // For iOS
            el.setSelectionRange(0, 99999);
            const ok = document.execCommand("copy");
            document.body.removeChild(el);
            if (ok) {
                showCopySuccess();
            } else {
                promptManualCopy(text);
            }
        } catch (err) {
            promptManualCopy(text);
        }
    };

    const showCopySuccess = () => {
        setCopied(true);
        setToastVisible(true);
        setTimeout(() => setCopied(false), 2500);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const promptManualCopy = (text) => {
        // Final fallback: prompt user to manually copy
        window.prompt("Salin kode booking ini secara manual (Ctrl+C / Cmd+C):", text);
    };

    const handleCopyCode = () => {
        if (activeBooking) {
            copyToClipboard(activeBooking.code);
        }
    };

    const getFormattedDisplayDate = (dateStr) => {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split("-");
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
        return `${daysOfWeek[dateObj.getDay()]}, ${d} ${months[dateObj.getMonth()]} ${y}`;
    };

    const getFormattedTimeSlot = (slotId) => {
        if (slotId === "pagi") return "Sesi Pagi (09:00 - 12:00)";
        if (slotId === "siang") return "Sesi Siang (13:00 - 16:00)";
        if (slotId === "sore") return "Sesi Sore/Malam (17:00 - 20:00)";
        return slotId;
    };

    // Define timeline steps and calculate which ones are completed/active
    const timelineSteps = [
        {
            id: "awaiting_verification",
            label: "Verifikasi Bukti Pembayaran",
            desc: "Menunggu verifikasi bukti transfer DP jasa & bukti biaya admin QRIS oleh Tim Keuangan Trasa Moment."
        },
        {
            id: "scheduled",
            label: "Dipesan & Dijadwalkan",
            desc: "Pembayaran berhasil diverifikasi. Jadwal dan slot fotografer Anda resmi dikunci."
        },
        {
            id: "shooting",
            label: "Sesi Pengambilan Foto/Video",
            desc: "Tim fotografer melaksanakan sesi liputan di lokasi acara sesuai jadwal."
        },
        {
            id: "editing",
            label: "Proses Editing & Kurasi",
            desc: "Editor kami melakukan kurasi file mentah dan menyunting warna (color grading)."
        },
        {
            id: "completed",
            label: "Selesai & Siap Diunduh",
            desc: "Seluruh berkas foto dan video final telah diunggah ke Google Drive dan siap diakses."
        }
    ];

    const getStatusIndex = (status) => {
        const mapping = {
            "awaiting_verification": 0,
            "scheduled": 1,
            "shooting": 2,
            "editing": 3,
            "completed": 4
        };
        return mapping[status] !== undefined ? mapping[status] : 0;
    };

    const currentStatusIdx = activeBooking ? getStatusIndex(activeBooking.status) : 0;
    const isNewBooking = justCheckedOut && initialBookingCode && activeBooking && activeBooking.code === initialBookingCode;

    return (
        <div className="min-h-screen bg-slate-50 py-6 lg:py-12 font-sans">
            {/* Toast Notification */}
            <div
                className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
                    toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                }`}
            >
                <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-bold">
                    <Check className="w-4 h-4" />
                    Kode Booking berhasil disalin ke clipboard!
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Button */}
                <div className="mb-5 lg:mb-8 flex justify-between items-center">
                    <button
                        onClick={onBackToLanding}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-brand-primary font-semibold text-sm transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Kembali ke Beranda</span>
                        <span className="sm:hidden">Beranda</span>
                    </button>
                    <span className="text-3xs uppercase tracking-widest text-slate-400 font-black">Portal Pelacakan</span>
                </div>

                {/* Section Title */}
                <div className="text-center mb-6 lg:mb-10 space-y-2">
                    <h1 className="text-xl sm:text-3xl font-extrabold text-brand-deep">Lacak Pemesanan Trasa Moment</h1>
                    <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        Gunakan Kode Booking unik (contoh: <strong>TRASA-XYZ123</strong>) untuk memeriksa status pesanan.
                    </p>
                </div>

                {/* Search Bar Container */}
                <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100/50 mb-8">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow">
                            <Search className="w-5 h-5 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                placeholder="Masukkan Kode Booking Anda (contoh: TRASA-XYZ123)"
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:normal-case placeholder:font-normal"
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <button
                            onClick={() => handleSearch()}
                            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-md cursor-pointer text-sm"
                        >
                            Cari Pesanan
                        </button>
                    </div>
                    {searchError && (
                        <p className="text-2xs text-red-500 font-semibold mt-3 flex items-center gap-1.5 px-1">
                            <Clock className="w-4 h-4 text-red-500 animate-pulse" />
                            {searchError}
                        </p>
                    )}
                </div>

                {/* Successful checkout code warning / copy reminder */}
                {isNewBooking && (
                    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-6 mb-8 text-slate-800 space-y-4 animate-[slide-up_0.6s_ease-out]">
                        <div className="flex gap-3">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-emerald-800">Pemesanan Berhasil Terkirim!</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Pemesanan Anda berhasil masuk ke sistem kami. <strong>PENTING: Harap salin dan simpan Kode Booking di bawah ini</strong> untuk memantau status pesanan dan ketersediaan fotografer di masa mendatang.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white/90 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-sm">
                            <div className="text-center sm:text-left">
                                <span className="text-3xs uppercase tracking-widest text-slate-450 font-bold block mb-0.5">Simpan Kode Booking Ini</span>
                                <span
                                    className="text-lg font-black text-brand-deep tracking-wider select-all cursor-pointer"
                                    onClick={handleCopyCode}
                                    title="Klik untuk menyalin"
                                >
                                    {activeBooking.code}
                                </span>
                            </div>
                            <button
                                id="btn-copy-booking-code"
                                onClick={handleCopyCode}
                                className={`font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                                    copied
                                        ? "bg-emerald-600 text-white"
                                        : "bg-brand-primary text-white hover:bg-brand-dark"
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Tersalin!
                                    </>
                                ) : (
                                    <>
                                        <CopyIcon className="w-4 h-4" />
                                        Salin Kode Booking
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Tracking Details Block */}
                {activeBooking ? (
                    <div className="space-y-8 animate-fade-in">
                        {/* Summary Info Header */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100/50 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="space-y-2">
                                <span className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-3xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Detail Booking Aktif
                                </span>
                                {/* Booking code + inline copy button */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-xl font-extrabold text-brand-deep">{activeBooking.code}</h2>
                                    <button
                                        id="btn-copy-code-inline"
                                        onClick={handleCopyCode}
                                        title="Salin kode booking"
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer border ${
                                            copied
                                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/30"
                                        }`}
                                    >
                                        {copied ? (
                                            <><Check className="w-3 h-3" /> Tersalin</>
                                        ) : (
                                            <><CopyIcon className="w-3 h-3" /> Salin</>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500">Pemesan: <strong className="text-slate-700 font-bold">{activeBooking.name}</strong></p>
                                <p className="text-3xs text-slate-400 mt-2">Pembaruan terakhir: {activeBooking.updatedAt}</p>
                            </div>
                            
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-semibold">Paket:</span>
                                    <span className="text-brand-deep font-extrabold text-right max-w-[180px] truncate">{activeBooking.package}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-semibold">Tanggal:</span>
                                    <span className="text-slate-700 font-extrabold">{getFormattedDisplayDate(activeBooking.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-semibold">Waktu Sesi:</span>
                                    <span className="text-slate-700 font-extrabold">{getFormattedTimeSlot(activeBooking.slot)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-semibold">Lokasi:</span>
                                    <span className="text-slate-700 font-extrabold text-right truncate max-w-[180px]">{activeBooking.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Progress Timeline (PRD Pipeline status mapping) */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100/50 space-y-8">
                            <div>
                                <h3 className="font-bold text-brand-deep text-sm tracking-wide uppercase">Linimasa Progres Pekerjaan</h3>
                                <p className="text-xs text-slate-400">Ikuti perkembangan status pemesanan sesi foto Anda</p>
                            </div>

                            <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-100 ml-4 space-y-8">
                                {timelineSteps.map((step, idx) => {
                                    const isCompleted = idx < currentStatusIdx;
                                    const isActive = idx === currentStatusIdx;
                                    
                                    let iconColor = "bg-slate-200 text-slate-400 border-slate-200";
                                    let activeRing = "";

                                    if (isCompleted) {
                                        iconColor = "bg-emerald-500 text-white border-emerald-500";
                                    } else if (isActive) {
                                        iconColor = "bg-brand-primary text-white border-brand-primary";
                                        activeRing = "ring-4 ring-brand-primary/20 animate-pulse";
                                    }

                                    return (
                                        <div key={step.id} className="relative">
                                            {/* Left icon marker */}
                                            <div className={`absolute -left-[39px] sm:-left-[47px] top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 border-white flex items-center justify-center text-xs font-bold transition-all duration-300 ${iconColor} ${activeRing}`}>
                                                {isCompleted ? (
                                                    <Check className="w-3.5 h-3.5" />
                                                ) : (
                                                    <span>{idx + 1}</span>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-1">
                                                <h4 className={`text-sm font-extrabold transition-colors ${
                                                    isCompleted ? "text-emerald-600" : isActive ? "text-brand-primary" : "text-slate-400"
                                                }`}>
                                                    {step.label}
                                                </h4>
                                                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{step.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Re-upload Payment Proof Section for Awaiting Payment (Rejected DP) */}
                        {activeBooking.status === "awaiting_payment" && (
                            <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-[slide-up_0.6s_ease-out]">
                                <div className="flex gap-4">
                                    <AlertCircle className="w-8 h-8 text-red-600 shrink-0 mt-1" />
                                    <div className="space-y-1">
                                        <h3 className="text-base sm:text-lg font-black text-red-800">Bukti Pembayaran Ditolak atau Belum Lengkap</h3>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Maaf, bukti transfer DP atau biaya admin yang Anda unggah sebelumnya tidak dapat diverifikasi oleh admin. Silakan unggah kembali bukti transfer DP (Rp 500.000) dan bukti biaya admin QRIS (Rp 5.000) yang valid untuk memproses ulang pemesanan Anda.
                                        </p>
                                    </div>
                                </div>

                                {reuploadSuccess && (
                                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold">
                                        Bukti pembayaran berhasil diunggah ulang! Status akan berubah menjadi "Menunggu Verifikasi" dan tim kami akan segera memprosesnya.
                                    </div>
                                )}

                                <form onSubmit={handleReuploadSubmit} className="space-y-5">
                                    {Object.keys(reuploadErrors).length > 0 && (
                                        <div className="bg-red-150/50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs font-bold space-y-1">
                                            {Object.values(reuploadErrors).map((err, idx) => (
                                                <p key={idx}>{err}</p>
                                            ))}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Uploader DP */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 block uppercase">Upload Bukti Transfer DP Jasa (Rp 500.000) *</label>
                                            {!receiptDp ? (
                                                <div className="border-2 border-dashed border-slate-200 hover:border-brand-primary bg-white rounded-2xl p-5 text-center transition-all">
                                                    <input
                                                        type="file"
                                                        id="reupload-receipt-dp"
                                                        accept="image/*,application/pdf"
                                                        onChange={handleFileChangeDp}
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="reupload-receipt-dp" className="cursor-pointer flex flex-col items-center justify-center gap-1.5">
                                                        <Upload className="w-7 h-7 text-slate-400" />
                                                        <span className="text-xs font-bold text-brand-deep">Pilih Bukti Transfer DP</span>
                                                        <span className="text-3xs text-slate-400">JPG, PNG, atau PDF (Maks. 5MB)</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary shrink-0">
                                                            <FileText className="w-4.5 h-4.5" />
                                                        </div>
                                                        <div className="truncate">
                                                            <p className="text-xs font-bold text-slate-800 truncate">{receiptDp.name}</p>
                                                            <p className="text-3xs text-slate-450">{(receiptDp.size / 1024).toFixed(1)} KB</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveFileDp}
                                                        className="p-1 hover:bg-slate-100 rounded-full text-slate-450 hover:text-red-500 cursor-pointer"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            {receiptDpPreview && (
                                                <div className="mt-2 rounded-2xl overflow-hidden border border-slate-200 max-h-32 bg-white p-1.5 flex justify-center">
                                                    <img src={receiptDpPreview} alt="DP Receipt Preview" className="max-h-28 object-contain rounded-xl" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Uploader Admin */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 block uppercase">Upload Bukti Scan QRIS Admin (Rp 5.000) *</label>
                                            {!receiptAdmin ? (
                                                <div className="border-2 border-dashed border-slate-200 hover:border-brand-primary bg-white rounded-2xl p-5 text-center transition-all">
                                                    <input
                                                        type="file"
                                                        id="reupload-receipt-admin"
                                                        accept="image/*,application/pdf"
                                                        onChange={handleFileChangeAdmin}
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="reupload-receipt-admin" className="cursor-pointer flex flex-col items-center justify-center gap-1.5">
                                                        <Upload className="w-7 h-7 text-slate-400" />
                                                        <span className="text-xs font-bold text-brand-deep">Pilih Bukti Biaya Admin</span>
                                                        <span className="text-3xs text-slate-400">JPG, PNG, atau PDF (Maks. 5MB)</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary shrink-0">
                                                            <FileText className="w-4.5 h-4.5" />
                                                        </div>
                                                        <div className="truncate">
                                                            <p className="text-xs font-bold text-slate-800 truncate">{receiptAdmin.name}</p>
                                                            <p className="text-3xs text-slate-450">{(receiptAdmin.size / 1024).toFixed(1)} KB</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveFileAdmin}
                                                        className="p-1 hover:bg-slate-100 rounded-full text-slate-450 hover:text-red-500 cursor-pointer"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            {receiptAdminPreview && (
                                                <div className="mt-2 rounded-2xl overflow-hidden border border-slate-200 max-h-32 bg-white p-1.5 flex justify-center">
                                                    <img src={receiptAdminPreview} alt="Admin Receipt Preview" className="max-h-28 object-contain rounded-xl" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isReuploading}
                                        className={`w-full py-3.5 rounded-full font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                                            isReuploading
                                                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                                : "bg-brand-primary text-white hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-primary/10"
                                        }`}
                                    >
                                        {isReuploading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Mengirim Ulang Bukti Pembayaran...
                                            </>
                                        ) : (
                                            <>
                                                Kirim Ulang Bukti Pembayaran
                                                <Upload className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Completed Output Download Card */}
                        {activeBooking.status === "completed" && (
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden animate-[bounce_1s_ease_1] select-none">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                    <div className="space-y-1.5">
                                        <h3 className="text-lg font-black">Hasil Foto/Video Siap Diunduh!</h3>
                                        <p className="text-xs text-emerald-100 leading-relaxed">
                                            Tim kami telah selesai memproses foto dan video Anda. Hasil final dapat diakses pada link di bawah ini.
                                        </p>
                                    </div>
                                    <a
                                        href={activeBooking.downloadUrl || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold px-6 py-3 rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 text-xs cursor-pointer select-none"
                                    >
                                        <Download className="w-4 h-4" />
                                        Unduh File Final
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Initial Search state placeholder
                    <div className="bg-white py-14 px-6 rounded-3xl shadow-md border border-slate-100/50 text-center space-y-4">
                        <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center text-slate-400 mx-auto border border-slate-100">
                            <FileText className="w-8 h-8 text-brand-primary" />
                        </div>
                        <div className="space-y-1 max-w-md mx-auto">
                            <h3 className="font-bold text-brand-deep text-base">Lihat Status Booking Anda</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Masukkan kode booking dari form pemesanan Anda atau gunakan contoh kode demo: <strong className="text-brand-primary font-bold">TRASA-XYZ123</strong> (dalam proses) atau <strong className="text-brand-primary font-bold">TRASA-COMPLETED</strong> (selesai) untuk mencoba fitur.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Arrow icon helper
function ArrowLeft(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    );
}
