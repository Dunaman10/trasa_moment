<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeroSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subtitle',
        'image_path_1',
        'image_path_2',
        'image_path_3',
        'image_path_4',
        'cta_text',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ─── Scopes ───────────────────────────────────────────────────

    /**
     * Scope: hero yang sedang aktif ditampilkan.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // ─── Helpers ──────────────────────────────────────────────────

    /**
     * Ambil satu hero setting yang aktif (singleton untuk landing page).
     */
    public static function current(): ?self
    {
        return self::active()->latest()->first();
    }
}
