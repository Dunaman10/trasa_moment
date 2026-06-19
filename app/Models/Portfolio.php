<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

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

    /**
     * Scope: urutkan berdasarkan display_order ascending.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
