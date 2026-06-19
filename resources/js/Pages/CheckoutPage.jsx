import React, { useState } from "react";
import { ArrowLeft, Check, ShieldCheck, MapPin, Upload, FileText, X, AlertCircle } from "lucide-react";

export default function CheckoutPage({ selectedPackage, bookingDate, bookingTimeSlot, onBack, onSuccess }) {
    const [name, setName] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [bank, setBank] = useState("bca");
    
    // File upload states for Photography Service DP
    const [receiptDp, setReceiptDp] = useState(null);
    const [receiptDpPreview, setReceiptDpPreview] = useState("");
    
    // File upload states for Admin Fee (Rp 5,000)
    const [receiptAdmin, setReceiptAdmin] = useState(null);
    const [receiptAdminPreview, setReceiptAdminPreview] = useState("");

    const [recaptchaChecked, setRecaptchaChecked] = useState(false);
    const [recaptchaLoading, setRecaptchaLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Format display date
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

    const handleRecaptcha = () => {
        if (recaptchaChecked) {
            setRecaptchaChecked(false);
            return;
        }
        setRecaptchaLoading(true);
        setTimeout(() => {
            setRecaptchaLoading(false);
            setRecaptchaChecked(true);
        }, 1200);
    };

    const handleMockFile = () => {
        const svgDp = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23a1c6e0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23182d44' font-weight='bold'>MOCK BUKTI DP FOTOGRAFI</text></svg>`;
        const blobDp = new Blob([svgDp], { type: "image/svg+xml" });
        const fileDp = new File([blobDp], "bukti_dp_fotografi_demo.svg", { type: "image/svg+xml" });
        setReceiptDp(fileDp);
        setReceiptDpPreview("data:image/svg+xml;utf8," + encodeURIComponent(svgDp));

        const svgAdmin = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%2387b1d5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23182d44' font-weight='bold'>MOCK BUKTI BIAYA ADMIN</text></svg>`;
        const blobAdmin = new Blob([svgAdmin], { type: "image/svg+xml" });
        const fileAdmin = new File([blobAdmin], "bukti_admin_qris_demo.svg", { type: "image/svg+xml" });
        setReceiptAdmin(fileAdmin);
        setReceiptAdminPreview("data:image/svg+xml;utf8," + encodeURIComponent(svgAdmin));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};

        if (!name.trim()) errors.name = "Nama lengkap wajib diisi";
        if (!whatsapp.trim()) {
            errors.whatsapp = "Nomor WhatsApp wajib diisi";
        } else if (!/^\+?[0-9]{9,15}$/.test(whatsapp.replace(/[\s-]/g, ""))) {
            errors.whatsapp = "Format nomor WhatsApp tidak valid";
        }
        if (!location.trim()) errors.location = "Lokasi acara wajib diisi";
        if (!receiptDp) errors.receiptDp = "Bukti transfer DP jasa fotografi wajib diunggah";
        if (!receiptAdmin) errors.receiptAdmin = "Bukti transfer biaya admin QRIS wajib diunggah";
        if (!recaptchaChecked) errors.recaptcha = "Silakan centang verifikasi keamanan reCAPTCHA";
        if (!termsAccepted) errors.terms = "Anda harus menyetujui syarat & ketentuan";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setFormErrors({});
        setIsSubmitting(true);

        // Build FormData
        const formData = new FormData();
        formData.append("name", name);
        formData.append("whatsapp", whatsapp);
        formData.append("package_id", selectedPackage?.id || 1); // fallback id 1
        formData.append("event_date", bookingDate);
        formData.append("booking_session", bookingTimeSlot);
        formData.append("event_location", location);
        formData.append("latitude", "-6.2088");
        formData.append("longitude", "106.8456");
        formData.append("special_notes", notes);
        formData.append("bank_destination", bank);
        formData.append("payment_proof_dp", receiptDp);
        formData.append("payment_proof_admin", receiptAdmin);

        fetch("/api/checkout", {
            method: "POST",
            body: formData,
        })
            .then(async (res) => {
                const data = await res.json();
                if (res.ok) {
                    setIsSubmitting(false);
                    onSuccess(data.booking_code);
                } else {
                    setIsSubmitting(false);
                    setFormErrors(data.errors || { general: "Terjadi kesalahan pada server" });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            })
            .catch((err) => {
                console.error("Checkout submission failed", err);
                setIsSubmitting(false);
                alert("Gagal menghubungi server. Silakan coba beberapa saat lagi.");
            });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-5 lg:py-10 font-sans pb-28 lg:pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Back Button */}
                <div className="mb-5 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-brand-primary font-semibold text-sm transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Kembali ke Jadwal</span>
                        <span className="sm:hidden">Kembali</span>
                    </button>
                    <div className="flex items-center space-x-2 text-brand-deep font-bold">
                        <ShieldCheck className="w-4 h-4 text-brand-primary" />
                        <span className="text-xs uppercase tracking-wide">Langkah 3: Checkout</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
                    
                    {/* Left: Input Form */}
                    <div className="lg:col-span-8 bg-white p-4 sm:p-6 lg:p-8 rounded-3xl shadow-xl border border-slate-100/50 space-y-5">
                        <div>
                            <h2 className="text-xl font-bold text-brand-deep">Formulir Pemesanan Sesi Foto (Guest Checkout)</h2>
                            <p className="text-xs text-slate-400">Silakan isi formulir dan unggah kedua bukti transfer pembayaran di bawah</p>
                        </div>

                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                            {Object.keys(formErrors).length > 0 && (
                                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-sm">Pemesanan tidak dapat dikirim karena ada field yang belum diisi atau salah:</h4>
                                        <ul className="list-disc list-inside text-xs mt-1.5 space-y-1 font-semibold">
                                            {Object.entries(formErrors).map(([key, val]) => (
                                                <li key={key}>{typeof val === "string" ? val : Array.isArray(val) ? val[0] : JSON.stringify(val)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            {/* Personal Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 block uppercase">Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Masukkan nama lengkap Anda"
                                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all ${
                                            formErrors.name ? "border-red-500 bg-red-50/20" : "border-slate-200"
                                        }`}
                                    />
                                    {formErrors.name && (
                                        <p className="text-2xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                                            <AlertCircle className="w-3.5 h-3.5" /> {formErrors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 block uppercase">Nomor WhatsApp *</label>
                                    <input
                                        type="tel"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        placeholder="Contoh: 08123456789"
                                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all ${
                                            formErrors.whatsapp ? "border-red-500 bg-red-50/20" : "border-slate-200"
                                        }`}
                                    />
                                    {formErrors.whatsapp && (
                                        <p className="text-2xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                                            <AlertCircle className="w-3.5 h-3.5" /> {formErrors.whatsapp}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Location Details */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 block uppercase">Alamat Lengkap Event/Sesi Foto *</label>
                                <textarea
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Tuliskan alamat lengkap lokasi acara atau studio foto pilihan"
                                    rows="2"
                                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none ${
                                        formErrors.location ? "border-red-500 bg-red-50/20" : "border-slate-200"
                                    }`}
                                />
                                {formErrors.location && (
                                    <p className="text-2xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> {formErrors.location}
                                    </p>
                                )}
                            </div>

                            {/* Maps API Simulation */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 block uppercase">Pin Point Lokasi Maps (Mockup)</label>
                                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-44 bg-slate-100 flex flex-col justify-between p-4">
                                    <div className="absolute inset-0 bg-brand-light/10 pointer-events-none flex items-center justify-center">
                                        <div className="w-64 h-64 border-4 border-dashed border-brand-accent/30 rounded-full animate-[spin_40s_linear_infinite]"></div>
                                    </div>
                                    
                                    <div className="relative z-10 flex justify-between items-start">
                                        <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 text-3xs font-extrabold text-slate-700 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                                            Google Maps API
                                        </span>
                                        <span className="bg-emerald-500 text-white px-2 py-1 rounded text-3xs font-black uppercase">Active Pin</span>
                                    </div>
                                    
                                    <div className="relative z-10 text-center space-y-1">
                                        <p className="text-xs font-bold text-brand-deep">Koordinat Terpilih: -6.2088, 106.8456</p>
                                        <p className="text-3xs text-slate-400">Peta disimulasikan sesuai dengan alamat di atas</p>
                                    </div>
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 block uppercase">Detail Tambahan / Catatan Khusus (Opsional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Tuliskan catatan khusus untuk fotografer (contoh: dresscode acara, referensi gaya, dll)"
                                    rows="2"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
                                />
                            </div>

                            {/* Payment 1: Photography DP Transfer Method */}
                            <div className="space-y-4 border-t border-slate-100 pt-6">
                                <div>
                                    <h3 className="font-bold text-brand-deep text-sm tracking-wide uppercase">Pembayaran 1: Down Payment (DP) Jasa Fotografi</h3>
                                    <p className="text-2xs text-slate-400">Transfer DP sebesar Rp 500.000 ke salah satu rekening Bank Trasa Moment berikut</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setBank("bca")}
                                        className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 flex justify-between items-center ${
                                            bank === "bca" ? "border-brand-primary bg-brand-primary/5 shadow-md" : "border-slate-100 hover:border-slate-200"
                                        }`}
                                    >
                                        <div>
                                            <span className="text-xs font-black text-brand-deep block">BANK BCA</span>
                                            <span className="text-xs text-slate-500 font-bold">8690-112-990</span>
                                            <span className="text-3xs text-slate-400 block mt-1">a/n Trasa Moment</span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            bank === "bca" ? "border-brand-primary bg-brand-primary text-white" : "border-slate-200"
                                        }`}>
                                            {bank === "bca" && <Check className="w-3.5 h-3.5" />}
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setBank("mandiri")}
                                        className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 flex justify-between items-center ${
                                            bank === "mandiri" ? "border-brand-primary bg-brand-primary/5 shadow-md" : "border-slate-100 hover:border-slate-200"
                                        }`}
                                    >
                                        <div>
                                            <span className="text-xs font-black text-brand-deep block">BANK MANDIRI</span>
                                            <span className="text-xs text-slate-500 font-bold">131-00-5523-909</span>
                                            <span className="text-3xs text-slate-400 block mt-1">a/n Trasa Moment</span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            bank === "mandiri" ? "border-brand-primary bg-brand-primary text-white" : "border-slate-200"
                                        }`}>
                                            {bank === "mandiri" && <Check className="w-3.5 h-3.5" />}
                                        </div>
                                    </div>
                                </div>

                                {/* Uploader for DP receipt */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 block uppercase">Upload Bukti Transfer DP Jasa *</label>
                                    
                                    {!receiptDp ? (
                                        <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                                            formErrors.receiptDp ? "border-red-500 bg-red-50/10" : "border-slate-200 hover:border-brand-primary bg-slate-50/50"
                                        }`}>
                                            <input
                                                type="file"
                                                id="receipt-dp-file"
                                                accept="image/*,application/pdf"
                                                onChange={handleFileChangeDp}
                                                className="hidden"
                                            />
                                            <label htmlFor="receipt-dp-file" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                                                <Upload className="w-8 h-8 text-slate-400" />
                                                <span className="text-xs font-bold text-brand-deep">Pilih Bukti Transfer DP</span>
                                                <span className="text-3xs text-slate-400">JPG, PNG, atau PDF (Maks. 5MB)</span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="max-w-[200px] sm:max-w-md">
                                                    <p className="text-xs font-bold text-slate-800 truncate">{receiptDp.name}</p>
                                                    <p className="text-3xs text-slate-400">{(receiptDp.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveFileDp}
                                                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-red-500 cursor-pointer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    {receiptDpPreview && (
                                        <div className="mt-3 rounded-2xl overflow-hidden border border-slate-100 max-h-40 max-w-xs bg-slate-100 p-2 flex justify-center">
                                            <img src={receiptDpPreview} alt="DP Receipt Preview" className="max-h-36 object-contain rounded-xl" />
                                        </div>
                                    )}

                                    {formErrors.receiptDp && (
                                        <p className="text-2xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                                            <AlertCircle className="w-3.5 h-3.5" /> {formErrors.receiptDp}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Payment 2: Admin Fee QRIS Scan Instructions & File Uploader */}
                            <div className="space-y-4 border-t border-slate-100 pt-6">
                                <div>
                                    <h3 className="font-bold text-brand-deep text-sm tracking-wide uppercase">Pembayaran 2: Biaya Admin Booking</h3>
                                    <p className="text-2xs text-slate-400">Scan QRIS di bawah ini sebesar Rp 5.000 untuk membayar biaya pemrosesan admin</p>
                                </div>

                                {/* QRIS Code Display */}
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-5 items-center">
                                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex-shrink-0 flex flex-col items-center select-none">
                                        {/* Inline SVG QR Code mockup */}
                                        <svg width="130" height="130" viewBox="0 0 130 130" className="text-slate-800">
                                            <rect width="130" height="130" fill="white" />
                                            {/* Finder pattern top-left */}
                                            <rect x="10" y="10" width="30" height="30" fill="currentColor" />
                                            <rect x="15" y="15" width="20" height="20" fill="white" />
                                            <rect x="20" y="20" width="10" height="10" fill="currentColor" />
                                            {/* Finder pattern top-right */}
                                            <rect x="90" y="10" width="30" height="30" fill="currentColor" />
                                            <rect x="95" y="15" width="20" height="20" fill="white" />
                                            <rect x="100" y="20" width="10" height="10" fill="currentColor" />
                                            {/* Finder pattern bottom-left */}
                                            <rect x="10" y="90" width="30" height="30" fill="currentColor" />
                                            <rect x="15" y="95" width="20" height="20" fill="white" />
                                            <rect x="20" y="100" width="10" height="10" fill="currentColor" />
                                            
                                            {/* Simulated noisy dots */}
                                            <rect x="50" y="10" width="10" height="10" fill="currentColor" />
                                            <rect x="70" y="10" width="10" height="20" fill="currentColor" />
                                            <rect x="50" y="30" width="20" height="10" fill="currentColor" />
                                            <rect x="60" y="50" width="10" height="10" fill="currentColor" />
                                            <rect x="10" y="50" width="10" height="20" fill="currentColor" />
                                            <rect x="30" y="70" width="10" height="10" fill="currentColor" />
                                            <rect x="90" y="50" width="20" height="10" fill="currentColor" />
                                            <rect x="100" y="70" width="10" height="20" fill="currentColor" />
                                            <rect x="70" y="90" width="10" height="10" fill="currentColor" />
                                            <rect x="50" y="100" width="20" height="10" fill="currentColor" />
                                            <rect x="70" y="110" width="10" height="10" fill="currentColor" />
                                            <rect x="90" y="100" width="10" height="20" fill="currentColor" />
                                            
                                            <rect x="45" y="45" width="40" height="40" fill="white" rx="4" />
                                            <rect x="47" y="47" width="36" height="36" fill="#182d44" rx="3" />
                                            <text x="65" y="68" fontFamily="sans-serif" fontSize="10" fill="white" textAnchor="middle" fontWeight="black">QRIS</text>
                                        </svg>
                                        <span className="text-[9px] font-black text-brand-deep tracking-wider mt-2">QRIS BIAYA ADMIN Rp 5.000</span>
                                    </div>
                                    <div className="space-y-2 flex-grow text-center md:text-left">
                                        <span className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-3xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                                            Admin Fee QRIS
                                        </span>
                                        <h4 className="font-extrabold text-sm text-brand-deep">Biaya Admin Pemrosesan Order</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Scan kode QRIS di samping menggunakan Gopay, OVO, Dana, ShopeePay, LinkAja, atau m-Banking Anda sebesar <strong>Rp 5.000</strong>. Unggah hasil tangkapan layar (screenshot) bukti bayarnya di bawah.
                                        </p>
                                    </div>
                                </div>

                                {/* Uploader for Admin receipt */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 block uppercase">Upload Bukti Scan QRIS Admin *</label>
                                    
                                    {!receiptAdmin ? (
                                        <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                                            formErrors.receiptAdmin ? "border-red-500 bg-red-50/10" : "border-slate-200 hover:border-brand-primary bg-slate-50/50"
                                        }`}>
                                            <input
                                                type="file"
                                                id="receipt-admin-file"
                                                accept="image/*,application/pdf"
                                                onChange={handleFileChangeAdmin}
                                                className="hidden"
                                            />
                                            <label htmlFor="receipt-admin-file" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                                                <Upload className="w-8 h-8 text-slate-400" />
                                                <span className="text-xs font-bold text-brand-deep">Pilih Bukti Pembayaran Admin (Rp 5.000)</span>
                                                <span className="text-3xs text-slate-400">JPG, PNG, atau PDF (Maks. 5MB)</span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="max-w-[200px] sm:max-w-md">
                                                    <p className="text-xs font-bold text-slate-800 truncate">{receiptAdmin.name}</p>
                                                    <p className="text-3xs text-slate-400">{(receiptAdmin.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveFileAdmin}
                                                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-red-500 cursor-pointer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    {receiptAdminPreview && (
                                        <div className="mt-3 rounded-2xl overflow-hidden border border-slate-100 max-h-40 max-w-xs bg-slate-100 p-2 flex justify-center">
                                            <img src={receiptAdminPreview} alt="Admin Receipt Preview" className="max-h-36 object-contain rounded-xl" />
                                        </div>
                                    )}

                                    {formErrors.receiptAdmin && (
                                        <p className="text-2xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                                            <AlertCircle className="w-3.5 h-3.5" /> {formErrors.receiptAdmin}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Demo verification tools (Testing only) */}
                            <div className="bg-slate-50/50 p-4 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-bold text-slate-700">Developer Testing Sandbox</h4>
                                    <p className="text-3xs text-slate-400">Mengisi berkas bukti transfer secara instan untuk melacak redirect</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleMockFile}
                                    id="btn-mock-file"
                                    className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-black px-4 py-2 rounded-xl text-3xs border border-brand-primary/20 cursor-pointer transition-all select-none self-start sm:self-auto"
                                >
                                    Gunakan File Demo untuk Testing
                                </button>
                            </div>

                            {/* Simulated Google reCAPTCHA */}
                            <div className="border-t border-slate-100 pt-6">
                                <div className={`inline-flex items-center justify-between p-4 bg-slate-50 border rounded-lg min-w-[280px] shadow-sm select-none transition-all ${
                                    formErrors.recaptcha ? "border-red-500" : "border-slate-200"
                                }`}>
                                    <div className="flex items-center gap-3.5">
                                        <button
                                            type="button"
                                            onClick={handleRecaptcha}
                                            disabled={recaptchaLoading}
                                            id="btn-recaptcha"
                                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                                                recaptchaChecked ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white"
                                            }`}
                                        >
                                            {recaptchaChecked && <Check className="w-4 h-4" />}
                                            {recaptchaLoading && (
                                                <div className="w-3.5 h-3.5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                            )}
                                        </button>
                                        <span className="text-xs font-medium text-slate-700">Saya bukan robot</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <img
                                            src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                                            alt="reCAPTCHA"
                                            className="w-7 h-7 object-contain opacity-80"
                                        />
                                        <span className="text-[8px] text-slate-400 font-bold tracking-tight">reCAPTCHA</span>
                                    </div>
                                </div>
                                {formErrors.recaptcha && (
                                    <p className="text-2xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> {formErrors.recaptcha}
                                    </p>
                                )}
                            </div>

                            {/* Terms and conditions Checkbox */}
                            <div className="space-y-2">
                                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer font-medium select-none">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        id="terms-checkbox"
                                        className="mt-0.5 rounded accent-brand-primary"
                                    />
                                    <span>
                                        Saya menyetujui bahwa data yang dimasukkan adalah benar, dan saya memahami bahwa order ini dapat dibatalkan jika bukti DP tidak valid / fiktif. *
                                    </span>
                                </label>
                                {formErrors.terms && (
                                    <p className="text-2xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> {formErrors.terms}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button - visible only on desktop; mobile uses sticky footer */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                id="btn-submit-checkout"
                                className={`hidden sm:flex w-full py-4 rounded-full font-bold text-sm shadow-md transition-all duration-300 items-center justify-center gap-2 cursor-pointer ${
                                    isSubmitting
                                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                        : "bg-brand-primary text-white hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-primary/10"
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Memproses Pemesanan...
                                    </>
                                ) : (
                                    <>
                                        Konfirmasi & Kirim Bukti DP
                                        <ShieldCheck className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right: Booking Summary Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Summary Header */}
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100/50 space-y-5">
                            <div>
                                <h3 className="font-bold text-brand-deep text-sm tracking-wide uppercase">Ringkasan Sesi</h3>
                                <p className="text-xs text-slate-400">Ringkasan paket dan jadwal ketersediaan terpilih</p>
                            </div>

                            <div className="space-y-4">
                                {/* Package Card */}
                                <div className="bg-gradient-to-r from-brand-deep to-brand-dark p-5 rounded-2xl text-white">
                                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Paket Terpilih</span>
                                    <h4 className="font-bold text-sm leading-tight">{selectedPackage?.name || "Gold Package"}</h4>
                                    <h5 className="font-extrabold text-base text-brand-light mt-1">{selectedPackage?.price || "Rp 4.900.000"}</h5>
                                </div>

                                {/* Schedule Details */}
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between border-b border-slate-100 pb-2.5">
                                        <span className="text-slate-400 font-bold">Tanggal Sesi</span>
                                        <span className="text-slate-700 font-extrabold text-right">{getFormattedDisplayDate(bookingDate)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2.5">
                                        <span className="text-slate-400 font-bold">Waktu Sesi</span>
                                        <span className="text-slate-700 font-extrabold">{getFormattedTimeSlot(bookingTimeSlot)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2.5">
                                        <span className="text-slate-400 font-bold">DP Jasa Fotografi</span>
                                        <span className="text-slate-700 font-extrabold text-brand-primary">Rp 500.000</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2.5">
                                        <span className="text-slate-400 font-bold">Biaya Admin (QRIS)</span>
                                        <span className="text-slate-700 font-extrabold">Rp 5.000</span>
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <span className="text-slate-400 font-bold">Total Pembayaran Awal</span>
                                        <span className="text-brand-primary font-black">Rp 505.000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Service Help Box */}
                        <div className="bg-brand-light/10 border border-brand-accent/20 rounded-3xl p-5 text-xs text-brand-dark/90 leading-relaxed space-y-2">
                            <span className="font-extrabold text-brand-deep block uppercase">Butuh Bantuan?</span>
                            <p>
                                Jika Anda mengalami kesulitan saat melakukan transfer atau pengisian formulir, jangan ragu untuk menghubungi customer support kami di WhatsApp <strong>+62 812-3456-7890</strong>.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile sticky bottom submit button */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-3 shadow-2xl">
                <button
                    form="checkout-form"
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className={`w-full py-3.5 rounded-full font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                        isSubmitting
                            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                            : "bg-brand-primary text-white active:bg-brand-dark"
                    }`}
                >
                    {isSubmitting ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Memproses...</>
                    ) : (
                        <><ShieldCheck className="w-4 h-4" /> Konfirmasi & Kirim Bukti DP</>
                    )}
                </button>
            </div>
        </div>
    );
}
