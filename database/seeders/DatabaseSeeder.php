<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Package;
use App\Models\Portfolio;
use App\Models\Testimonial;
use App\Models\HeroSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Admin User
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Trasa Moment',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Seed Hero Settings
        HeroSetting::updateOrCreate(
            ['title' => 'Abadikan Setiap Momen Berharga Bersama Kami'],
            [
                'subtitle' => 'Penyedia jasa fotografi & videografi profesional dengan rekomendasi paket berbasis kecerdasan buatan.',
                'image_path_1' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
                'image_path_2' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
                'image_path_3' => 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600',
                'image_path_4' => 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600',
                'cta_text' => 'Booking Sekarang',
                'is_active' => true,
            ]
        );

        // 4. Seed Packages
        $bronze = Package::updateOrCreate(
            ['name' => 'Bronze Package'],
            [
                'description' => 'Sangat cocok untuk kebutuhan pas foto, portrait personal, atau sesi singkat wisuda. Termasuk 1 fotografer, 1 jam sesi, dan 10 foto editan.',
                'base_price' => 1500000.00,
                'duration_hours' => 1,
                'is_active' => true,
            ]
        );

        $silver = Package::updateOrCreate(
            ['name' => 'Silver Package'],
            [
                'description' => 'Pilihan terpopuler untuk foto pre-wedding outdoor atau dokumentasi event ulang tahun. Termasuk 2 fotografer, 4 jam sesi, 50 foto editan, cetak 10R.',
                'base_price' => 3500000.00,
                'duration_hours' => 4,
                'is_active' => true,
            ]
        );

        $gold = Package::updateOrCreate(
            ['name' => 'Gold Package'],
            [
                'description' => 'Paket premium lengkap untuk hari pernikahan (wedding day) atau liputan grand event seharian penuh. Termasuk 3 fotografer, 1 videografer, full day (12 jam) sesi, seluruh file mentah, cetak album kolase mewah.',
                'base_price' => 7500000.00,
                'duration_hours' => 12,
                'is_active' => true,
            ]
        );

        $platinum = Package::updateOrCreate(
            ['name' => 'Platinum Package'],
            [
                'description' => 'Layanan VIP termewah untuk hari pernikahan akbar. Menawarkan liputan multi-angle cinematic, liputan video drone udara, same-day edit video clip teaser, dan album eksklusif box kayu.',
                'base_price' => 12500000.00,
                'duration_hours' => 12,
                'is_active' => true,
            ]
        );

        // 5. Seed Portfolios
        $portfolios = [
            ['title' => 'Classic Traditional Wedding', 'category' => 'wedding', 'image_path' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', 'display_order' => 1, 'is_featured' => true],
            ['title' => 'Vibrant Outdoor Graduation', 'category' => 'graduation', 'image_path' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800', 'display_order' => 2, 'is_featured' => true],
            ['title' => 'Modern Cinematic Pre-wedding', 'category' => 'wedding', 'image_path' => 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', 'display_order' => 3, 'is_featured' => true],
            ['title' => 'Minimalist Fine Art Portrait', 'category' => 'personal', 'image_path' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', 'display_order' => 4, 'is_featured' => true],
            ['title' => 'Corporate Seminar & Event', 'category' => 'event', 'image_path' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800', 'display_order' => 5, 'is_featured' => true],
            ['title' => 'Studio Family Session', 'category' => 'personal', 'image_path' => 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800', 'display_order' => 6, 'is_featured' => true],
        ];
        foreach ($portfolios as $port) {
            Portfolio::updateOrCreate(['title' => $port['title']], $port);
        }

        // 6. Seed Testimonials
        $testimonials = [
            [
                'client_name' => 'Rian & Sarah',
                'client_avatar_path' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
                'event_category' => 'wedding',
                'review_text' => 'Sistem rekomendasi paketnya sangat membantu! Awalnya bingung pilih paket untuk pernikahan intim kami di taman. Sliders sangat presisi dan hasilnya benar-benar luar biasa.',
                'rating' => 5,
                'display_order' => 1,
                'is_visible' => true,
            ],
            [
                'client_name' => 'Fadel Rahman',
                'client_avatar_path' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=150',
                'event_category' => 'graduation',
                'review_text' => 'Checkout sebagai guest sangat mempermudah pemesanan slot pas foto wisuda tanpa harus pusing bikin akun. Pelacakan pesanan menggunakan kode TRASA juga transparan sekali.',
                'rating' => 5,
                'display_order' => 2,
                'is_visible' => true,
            ],
            [
                'client_name' => 'Citra Kirana',
                'client_avatar_path' => 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150',
                'event_category' => 'prewedding',
                'review_text' => 'Terima kasih Trasa Moment! Layanan dari sebelum hari H sampai penyerahan file sangat memuaskan. Album photobook cetak yang dikirim eksklusif sekali.',
                'rating' => 5,
                'display_order' => 3,
                'is_visible' => true,
            ]
        ];
        foreach ($testimonials as $testi) {
            Testimonial::updateOrCreate(['client_name' => $testi['client_name']], $testi);
        }

    }
}

