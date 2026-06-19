<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'base_price',
        'duration_hours',
        'is_active',
    ];

    protected $casts = [
        'base_price'     => 'decimal:2',
        'duration_hours' => 'integer',
        'is_active'      => 'boolean',
    ];

    // ─── Relasi ───────────────────────────────────────────────────

    /**
     * Semua booking yang menggunakan paket ini.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }


    // ─── Scopes ───────────────────────────────────────────────────

    /**
     * Scope: hanya paket yang aktif / ditampilkan di frontend.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // ─── Accessors ────────────────────────────────────────────────

    /**
     * Hitung nominal Down Payment flat Rp 500.000.
     */
    public function getDpAmountAttribute(): float
    {
        return 500000.00;
    }


    /**
     * Format harga ke format Rupiah (ex: "Rp 4.900.000").
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->base_price, 0, ',', '.');
    }
}
