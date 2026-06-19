<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FuzzyRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_membership_id',
        'scale_membership_id',
        'duration_membership_id',
        'recommended_package_id',
    ];

    // ─── Relasi ───────────────────────────────────────────────────

    /**
     * Membership kondisi: IF Budget IS [label]
     */
    public function budgetMembership(): BelongsTo
    {
        return $this->belongsTo(FuzzyMembership::class, 'budget_membership_id');
    }

    /**
     * Membership kondisi: AND Scale IS [label]
     */
    public function scaleMembership(): BelongsTo
    {
        return $this->belongsTo(FuzzyMembership::class, 'scale_membership_id');
    }

    /**
     * Membership kondisi: AND Duration IS [label]
     */
    public function durationMembership(): BelongsTo
    {
        return $this->belongsTo(FuzzyMembership::class, 'duration_membership_id');
    }

    /**
     * THEN Package IS [recommended_package]
     */
    public function recommendedPackage(): BelongsTo
    {
        return $this->belongsTo(Package::class, 'recommended_package_id');
    }

    // ─── Helpers ──────────────────────────────────────────────────

    /**
     * Hitung firing strength aturan ini menggunakan operator MIN (Mamdani).
     * Sesuai PRD §4.2: kombinasi nilai input dipetakan menggunakan implikasi MIN (AND).
     *
     * @param  float $budget   Nilai input budget (Rupiah)
     * @param  float $scale    Nilai input skala acara (1–10)
     * @param  float $duration Nilai input durasi (jam)
     * @return float           Firing strength (0.0 – 1.0)
     */
    public function firingStrength(float $budget, float $scale, float $duration): float
    {
        $muBudget   = $this->budgetMembership->evaluate($budget);
        $muScale    = $this->scaleMembership->evaluate($scale);
        $muDuration = $this->durationMembership->evaluate($duration);

        return min($muBudget, $muScale, $muDuration);
    }
}
