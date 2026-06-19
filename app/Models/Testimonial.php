<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_name',
        'client_avatar_path',
        'event_category',
        'review_text',
        'rating',
        'display_order',
        'is_visible',
    ];

    protected $casts = [
        'rating'        => 'integer',
        'display_order' => 'integer',
        'is_visible'    => 'boolean',
    ];

    // ─── Scopes ───────────────────────────────────────────────────

    /**
     * Scope: hanya tampilkan yang sudah diaktifkan (is_visible = true).
     */
    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }

    /**
     * Scope: urutkan berdasarkan display_order ascending.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
