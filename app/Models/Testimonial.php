<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Testimonial extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

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

    protected $appends = ['client_avatar_path'];

    public function getClientAvatarPathAttribute()
    {
        return $this->getFirstMediaUrl('avatar') ?: ($this->attributes['client_avatar_path'] ?? null);
    }

    protected static function booted()
    {
        static::saving(function ($testimonial) {
            if (empty($testimonial->client_avatar_path)) {
                $testimonial->client_avatar_path = '';
            }
        });
    }

    // ─── Scopes ───────────────────────────────────────────────────

    /**
     * Scope: hanya tampilkan yang sudah diaktifkan (is_visible = true).
     */
    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }

    /**
     * Scope: urutkan berdasarkan testimoni terbaru.
     */
    public function scopeOrdered($query)
    {
        return $query->latest();
    }
}
