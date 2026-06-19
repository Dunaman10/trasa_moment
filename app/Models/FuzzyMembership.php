<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FuzzyMembership extends Model
{
    use HasFactory;

    protected $fillable = [
        'variable_id',
        'label',
        'point_a',
        'point_b',
        'point_c',
        'point_d',
    ];

    protected $casts = [
        'point_a' => 'decimal:4',
        'point_b' => 'decimal:4',
        'point_c' => 'decimal:4',
        'point_d' => 'decimal:4',
    ];

    // ─── Relasi ───────────────────────────────────────────────────

    /**
     * Variabel fuzzy (budget / scale / duration) yang memiliki membership ini.
     */
    public function variable(): BelongsTo
    {
        return $this->belongsTo(FuzzyVariable::class, 'variable_id');
    }

    /**
     * Aturan fuzzy di mana membership ini dipakai sebagai kondisi budget.
     */
    public function rulesAsBudget(): HasMany
    {
        return $this->hasMany(FuzzyRule::class, 'budget_membership_id');
    }

    /**
     * Aturan fuzzy di mana membership ini dipakai sebagai kondisi scale.
     */
    public function rulesAsScale(): HasMany
    {
        return $this->hasMany(FuzzyRule::class, 'scale_membership_id');
    }

    /**
     * Aturan fuzzy di mana membership ini dipakai sebagai kondisi duration.
     */
    public function rulesAsDuration(): HasMany
    {
        return $this->hasMany(FuzzyRule::class, 'duration_membership_id');
    }

    // ─── Helpers ──────────────────────────────────────────────────

    /**
     * Hitung derajat keanggotaan (µ) dari sebuah nilai input menggunakan
     * fungsi keanggotaan trapesium: [a, b, c, d].
     *
     *       1  ___________
     *         /           \
     *        /             \
     *   0 --a---b---------c---d-->
     *
     * @param  float $x Nilai input yang ingin dievaluasi
     * @return float    Derajat keanggotaan (0.0 – 1.0)
     */
    public function evaluate(float $x): float
    {
        $a = (float) $this->point_a;
        $b = (float) $this->point_b;
        $c = (float) $this->point_c;
        $d = (float) $this->point_d;

        if ($x <= $a || $x >= $d) return 0.0;
        if ($x >= $b && $x <= $c) return 1.0;
        if ($x > $a && $x < $b)   return ($x - $a) / ($b - $a);
        if ($x > $c && $x < $d)   return ($d - $x) / ($d - $c);

        return 0.0;
    }
}
