<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarBlock extends Model
{
    use HasFactory;

    protected $fillable = [
        'block_date',
        'title',
    ];

    protected $casts = [
        'block_date' => 'date',
    ];

    // ─── Scopes ───────────────────────────────────────────────────

    /**
     * Scope: blokir yang belum terlewat (relevan untuk kalender publik).
     */
    public function scopeUpcoming($query)
    {
        return $query->where('block_date', '>=', now()->toDateString());
    }

    // ─── Helpers ──────────────────────────────────────────────────

    /**
     * Cek apakah tanggal tertentu diblokir oleh admin.
     */
    public static function isBlocked(string $date): bool
    {
        return self::where('block_date', $date)->exists();
    }
}
