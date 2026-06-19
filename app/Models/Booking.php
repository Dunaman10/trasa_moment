<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'customer_name',
        'customer_email',
        'customer_phone',
        'package_id',
        'event_date',
        'booking_session',
        'event_location',
        'latitude',
        'longitude',
        'special_notes',
        'bank_destination',
        'status',
        'dp_amount',
        'admin_fee',
        'total_price',
        'payment_proof_dp_path',
        'payment_proof_admin_path',
        'final_drive_link',
    ];

    protected $casts = [
        'event_date'  => 'date',
        'dp_amount'   => 'decimal:2',
        'admin_fee'   => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    /**
     * Status yang tersedia dalam pipeline pemesanan (sesuai PRD).
     *
     * awaiting_payment  → Customer sudah submit form, menunggu bukti transfer
     * awaiting_verification → Bukti transfer sudah diunggah, menunggu disetujui Admin
     * scheduled         → DP diverifikasi, jadwal resmi dikunci
     * shooting          → Sesi foto sedang berlangsung
     * editing           → File mentah sedang diproses/edit
     * completed         → File final siap diunduh
     * cancelled         → Dibatalkan (manual atau auto-expire)
     */
    const STATUS_AWAITING_PAYMENT       = 'awaiting_payment';
    const STATUS_AWAITING_VERIFICATION  = 'awaiting_verification';
    const STATUS_SCHEDULED              = 'scheduled';
    const STATUS_SHOOTING               = 'shooting';
    const STATUS_EDITING                = 'editing';
    const STATUS_COMPLETED              = 'completed';
    const STATUS_CANCELLED              = 'cancelled';

    /**
     * Seluruh nilai status yang valid.
     */
    public static function statuses(): array
    {
        return [
            self::STATUS_AWAITING_PAYMENT,
            self::STATUS_AWAITING_VERIFICATION,
            self::STATUS_SCHEDULED,
            self::STATUS_SHOOTING,
            self::STATUS_EDITING,
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED,
        ];
    }

    /**
     * Label status dalam Bahasa Indonesia (untuk Filament / UI).
     */
    public static function statusLabels(): array
    {
        return [
            self::STATUS_AWAITING_PAYMENT      => 'Menunggu Pembayaran',
            self::STATUS_AWAITING_VERIFICATION => 'Menunggu Verifikasi',
            self::STATUS_SCHEDULED             => 'Dijadwalkan',
            self::STATUS_SHOOTING              => 'Sesi Berlangsung',
            self::STATUS_EDITING               => 'Proses Editing',
            self::STATUS_COMPLETED             => 'Selesai',
            self::STATUS_CANCELLED             => 'Dibatalkan',
        ];
    }

    // ─── Relasi ───────────────────────────────────────────────────

    /**
     * Paket fotografi yang dipilih customer.
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────

    /** Booking yang masih aktif (belum selesai dan belum dibatalkan). */
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED,
        ]);
    }

    /** Booking yang sudah mengunggah bukti bayar dan menunggu persetujuan admin. */
    public function scopePendingVerification($query)
    {
        return $query->where('status', self::STATUS_AWAITING_VERIFICATION);
    }

    /**
     * Booking yang telah melewati batas waktu unggah bukti bayar
     * (digunakan oleh Task Scheduling / Auto-Expire per PRD).
     */
    public function scopeExpired($query, int $minutesLimit = 60)
    {
        return $query
            ->where('status', self::STATUS_AWAITING_PAYMENT)
            ->where('created_at', '<=', now()->subMinutes($minutesLimit));
    }

    // ─── Accessors ────────────────────────────────────────────────

    /** Label status berbahasa Indonesia. */
    public function getStatusLabelAttribute(): string
    {
        return self::statusLabels()[$this->status] ?? $this->status;
    }

    /** Cek apakah slot jadwal sudah dikonfirmasi (bisa tampil di kalender publik sebagai Booked). */
    public function getIsConfirmedAttribute(): bool
    {
        return in_array($this->status, [
            self::STATUS_SCHEDULED,
            self::STATUS_SHOOTING,
            self::STATUS_EDITING,
            self::STATUS_COMPLETED,
        ]);
    }

    /** Cek apakah booking dalam status "Hold" (sudah mengisi form tapi belum diverifikasi). */
    public function getIsHoldAttribute(): bool
    {
        return in_array($this->status, [
            self::STATUS_AWAITING_PAYMENT,
            self::STATUS_AWAITING_VERIFICATION,
        ]);
    }

    // ─── Helpers ──────────────────────────────────────────────────

    /**
     * Generate Kode Booking unik berformat TRASA-XXXXXX
     * (6 karakter alfanumerik acak, huruf kapital).
     */
    public static function generateBookingCode(): string
    {
        do {
            $code = 'TRASA-' . strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 6));
        } while (self::where('booking_code', $code)->exists());

        return $code;
    }
}
