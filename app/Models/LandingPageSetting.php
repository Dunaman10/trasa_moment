<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class LandingPageSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    // ─── Helpers ──────────────────────────────────────────────────

    /**
     * Ambil nilai setting berdasarkan key.
     * Menggunakan cache otomatis (60 menit) agar tidak query tiap request.
     *
     * @param  string      $key
     * @param  mixed|null  $default Nilai fallback jika key tidak ditemukan
     * @return mixed
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember("landing_setting_{$key}", 3600, function () use ($key, $default) {
            $setting = self::where('key', $key)->first();
            return $setting?->value ?? $default;
        });
    }

    /**
     * Simpan atau perbarui setting berdasarkan key (upsert),
     * dan hapus cache terkait secara otomatis.
     *
     * @param  string $key
     * @param  mixed  $value
     * @return static
     */
    public static function set(string $key, mixed $value): static
    {
        $instance = self::updateOrCreate(
            ['key'   => $key],
            ['value' => $value]
        );

        Cache::forget("landing_setting_{$key}");

        return $instance;
    }
}
