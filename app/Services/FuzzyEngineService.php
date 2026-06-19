<?php

namespace App\Services;

use App\Models\Package;
use App\Models\FuzzyRule;
use App\Models\FuzzyVariable;
use App\Models\FuzzyMembership;

class FuzzyEngineService
{
    /**
     * Jalankan inferensi Fuzzy Mamdani untuk merekomendasikan paket.
     *
     * @param float $budget Input budget (Rupiah)
     * @param float $scale Input skala acara (1-10)
     * @param float $duration Input durasi (jam)
     * @return array Array berisi skor kelayakan (0-100) untuk setiap paket
     */
    public static function recommend(float $budget, float $scale, float $duration): array
    {
        // 1. Ambil seluruh paket yang aktif
        $packages = Package::active()->get();
        if ($packages->isEmpty()) {
            return [];
        }

        // 2. Ambil seluruh aturan fuzzy beserta relasi membership-nya
        $rules = FuzzyRule::with(['budgetMembership', 'scaleMembership', 'durationMembership'])->get();

        // 3. Evaluasi firing strength (µ) untuk setiap rule menggunakan implikasi MIN
        $packageStrengths = [];
        foreach ($packages as $pkg) {
            $packageStrengths[$pkg->id] = 0.0;
        }

        foreach ($rules as $rule) {
            // Hitung firing strength rule
            $strength = $rule->firingStrength($budget, $scale, $duration);

            $pkgId = $rule->recommended_package_id;
            if (isset($packageStrengths[$pkgId])) {
                // Sesuai Mamdani, jika beberapa rule merujuk ke paket yang sama, ambil nilai MAX
                $packageStrengths[$pkgId] = max($packageStrengths[$pkgId], $strength);
            }
        }

        // 4. Defuzzifikasi / Normalisasi menjadi persentase skor kelayakan (0 - 100%)
        $maxStrength = max($packageStrengths);
        $scores = [];

        if ($maxStrength > 0) {
            foreach ($packageStrengths as $pkgId => $strength) {
                // Skalakan relatif terhadap nilai kecocokan tertinggi
                $scores[$pkgId] = (int) round(($strength / $maxStrength) * 100);
            }
        } else {
            // Fallback heuristik jika semua rule bernilai 0 (karena input berada di luar kurva membership)
            // Hitung jarak (distance) ke parameter ideal masing-masing paket
            $distances = [];
            foreach ($packages as $pkg) {
                // Asumsi nilai target ideal untuk tiap paket berdasarkan base_price, skala rata-rata, durasi
                $targetBudget = (float) $pkg->base_price;
                $targetDuration = (float) $pkg->duration_hours;
                
                // Set target skala estimasi
                $targetScale = 5.0; // default
                if (str_contains(strtolower($pkg->name), 'bronze')) $targetScale = 2.0;
                if (str_contains(strtolower($pkg->name), 'silver')) $targetScale = 5.0;
                if (str_contains(strtolower($pkg->name), 'gold')) $targetScale = 8.0;
                if (str_contains(strtolower($pkg->name), 'platinum')) $targetScale = 9.5;

                $bDist = abs($budget - $targetBudget) / 10000000;
                $sDist = abs($scale - $targetScale) / 10;
                $dDist = abs($duration - $targetDuration) / 12;

                $distances[$pkg->id] = $bDist + $sDist + $dDist;
            }

            $maxDist = max($distances);
            if ($maxDist > 0) {
                foreach ($distances as $pkgId => $dist) {
                    $scores[$pkgId] = (int) round((($maxDist - $dist) / $maxDist) * 100);
                }
            } else {
                foreach ($packages as $pkg) {
                    $scores[$pkg->id] = 50; // default fallback
                }
            }
        }

        // Format return keys agar sesuai dengan slug paket (misal: 'bronze', 'silver', 'gold', 'platinum')
        $formattedResult = [];
        foreach ($packages as $pkg) {
            $slug = strtolower(explode(' ', $pkg->name)[0]);
            $formattedResult[$slug] = $scores[$pkg->id] ?? 0;
        }

        return $formattedResult;
    }
}
