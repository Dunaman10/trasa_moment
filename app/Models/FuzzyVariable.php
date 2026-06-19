<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FuzzyVariable extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    // ─── Relasi ───────────────────────────────────────────────────

    /**
     * Himpunan keanggotaan (membership functions) dari variabel ini.
     * Setiap variabel (budget, scale, duration) memiliki beberapa label (Terbatas, Menengah, Tinggi dst).
     */
    public function memberships(): HasMany
    {
        return $this->hasMany(FuzzyMembership::class, 'variable_id');
    }
}
