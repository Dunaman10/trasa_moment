<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Portfolio extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'category',
        'image_path',
        'display_order',
        'is_featured',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'is_featured'   => 'boolean',
    ];

    // ─── Scopes ───────────────────────────────────────────────────

    /**
     * Scope: hanya portfolio yang difeatured di landing page.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    protected $appends = ['image_path'];

    public function getImagePathAttribute()
    {
        return $this->getFirstMediaUrl('portfolio_gallery') ?: ($this->attributes['image_path'] ?? null);
    }

    /**
     * Scope: urutkan berdasarkan portfolio terbaru (newest first).
     */
    public function scopeOrdered($query)
    {
        return $query->latest();
    }
}
