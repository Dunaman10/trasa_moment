<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Package;
use App\Models\Portfolio;
use App\Models\Testimonial;
use App\Models\HeroSetting;
use App\Models\LandingPageSetting;
use App\Models\FuzzyVariable;
use App\Models\FuzzyMembership;
use App\Models\FuzzyRule;
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
            ['email' => 'admin@trasa.com'],
            [
                'name' => 'Admin Trasa Moment',
                'password' => Hash::make('password123'),
            ]
        );

        // 2. Seed Hero Settings
        HeroSetting::updateOrCreate(
            ['title' => 'Abadikan Setiap Momen Berharga Bersama Kami'],
            [
                'subtitle' => 'Penyedia jasa fotografi & videografi profesional dengan rekomendasi paket berbasis kecerdasan buatan.',
                'image_path' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
                'cta_text' => 'Booking Sekarang',
                'is_active' => true,
            ]
        );

        // 3. Seed Landing Page Settings
        LandingPageSetting::set('whatsapp_number', '628123456789');
        LandingPageSetting::set('instagram_username', 'trasa.moment');
        LandingPageSetting::set('office_address', 'Jl. Sudirman No. 123, Jakarta Selatan');
        LandingPageSetting::set('qris_image_path', 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=300');
        LandingPageSetting::set('bca_account_number', '123-456-7890');
        LandingPageSetting::set('mandiri_account_number', '987-654-3210');
        LandingPageSetting::set('account_name', 'Trasa Moment Studio');

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

        // 7. Seed Fuzzy Variables & Memberships
        $vBudget = FuzzyVariable::updateOrCreate(['name' => 'Budget'], ['description' => 'Budget pelanggan dalam Rupiah']);
        $vScale = FuzzyVariable::updateOrCreate(['name' => 'Scale'], ['description' => 'Skala / Kerumitan acara (skala 1-10)']);
        $vDuration = FuzzyVariable::updateOrCreate(['name' => 'Duration'], ['description' => 'Durasi kebutuhan sesi dalam jam']);

        // Budget Memberships
        $mLowBudget = FuzzyMembership::updateOrCreate(
            ['variable_id' => $vBudget->id, 'label' => 'Terbatas'],
            ['point_a' => 0.0, 'point_b' => 0.0, 'point_c' => 1500000.0, 'point_d' => 2500000.0]
        );
        $mMidBudget = FuzzyMembership::updateOrCreate(
            ['variable_id' => $vBudget->id, 'label' => 'Menengah'],
            ['point_a' => 1500000.0, 'point_b' => 2500000.0, 'point_c' => 4500000.0, 'point_d' => 6000000.0]
        );
        $mHighBudget = FuzzyMembership::updateOrCreate(
            ['variable_id' => $vBudget->id, 'label' => 'Tinggi'],
            ['point_a' => 4500000.0, 'point_b' => 6000000.0, 'point_c' => 15000000.0, 'point_d' => 15000000.0]
        );

        // Scale Memberships
        $mIntimate = FuzzyMembership::updateOrCreate(
            ['variable_id' => $vScale->id, 'label' => 'Intimate'],
            ['point_a' => 1.0, 'point_b' => 1.0, 'point_c' => 3.0, 'point_d' => 5.0]
        );
        $mStandar = FuzzyMembership::updateOrCreate(
            ['variable_id' => $vScale->id, 'label' => 'Standar'],
            ['point_a' => 4.0, 'point_b' => 5.0, 'point_c' => 7.0, 'point_d' => 8.0]
        );
        $mGrand = FuzzyMembership::updateOrCreate(
            ['variable_id' => $vScale->id, 'label' => 'Grand'],
            ['point_a' => 7.0, 'point_b' => 8.0, 'point_c' => 10.0, 'point_d' => 10.0]
        );

        // Duration Memberships
        $mShort = FuzzyMembership::updateOrCreate(
            ['variable_id' => $vDuration->id, 'label' => 'Singkat'],
            ['point_a' => 1.0, 'point_b' => 1.0, 'point_c' => 2.0, 'point_d' => 4.0]
        );
        $mReguler = FuzzyMembership::updateOrCreate(
            ['variable_id' => $vDuration->id, 'label' => 'Reguler'],
            ['point_a' => 3.0, 'point_b' => 4.0, 'point_c' => 6.0, 'point_d' => 8.0]
        );
        $mFullDay = FuzzyMembership::updateOrCreate(
            ['variable_id' => $vDuration->id, 'label' => 'Seharian'],
            ['point_a' => 6.0, 'point_b' => 8.0, 'point_c' => 12.0, 'point_d' => 12.0]
        );

        // 8. Seed Fuzzy Rules mapping all combinations to the packages
        // Setup combinations: 3 budget * 3 scale * 3 duration = 27 rules
        $rules = [
            // Terbatas budget
            ['b' => $mLowBudget, 's' => $mIntimate, 'd' => $mShort, 'p' => $bronze],
            ['b' => $mLowBudget, 's' => $mIntimate, 'd' => $mReguler, 'p' => $bronze],
            ['b' => $mLowBudget, 's' => $mIntimate, 'd' => $mFullDay, 'p' => $bronze],
            ['b' => $mLowBudget, 's' => $mStandar, 'd' => $mShort, 'p' => $bronze],
            ['b' => $mLowBudget, 's' => $mStandar, 'd' => $mReguler, 'p' => $silver],
            ['b' => $mLowBudget, 's' => $mStandar, 'd' => $mFullDay, 'p' => $silver],
            ['b' => $mLowBudget, 's' => $mGrand, 'd' => $mShort, 'p' => $silver],
            ['b' => $mLowBudget, 's' => $mGrand, 'd' => $mReguler, 'p' => $silver],
            ['b' => $mLowBudget, 's' => $mGrand, 'd' => $mFullDay, 'p' => $silver],

            // Menengah budget
            ['b' => $mMidBudget, 's' => $mIntimate, 'd' => $mShort, 'p' => $bronze],
            ['b' => $mMidBudget, 's' => $mIntimate, 'd' => $mReguler, 'p' => $silver],
            ['b' => $mMidBudget, 's' => $mIntimate, 'd' => $mFullDay, 'p' => $silver],
            ['b' => $mMidBudget, 's' => $mStandar, 'd' => $mShort, 'p' => $silver],
            ['b' => $mMidBudget, 's' => $mStandar, 'd' => $mReguler, 'p' => $silver],
            ['b' => $mMidBudget, 's' => $mStandar, 'd' => $mFullDay, 'p' => $gold],
            ['b' => $mMidBudget, 's' => $mGrand, 'd' => $mShort, 'p' => $silver],
            ['b' => $mMidBudget, 's' => $mGrand, 'd' => $mReguler, 'p' => $gold],
            ['b' => $mMidBudget, 's' => $mGrand, 'd' => $mFullDay, 'p' => $gold],

            // Tinggi budget
            ['b' => $mHighBudget, 's' => $mIntimate, 'd' => $mShort, 'p' => $silver],
            ['b' => $mHighBudget, 's' => $mIntimate, 'd' => $mReguler, 'p' => $silver],
            ['b' => $mHighBudget, 's' => $mIntimate, 'd' => $mFullDay, 'p' => $gold],
            ['b' => $mHighBudget, 's' => $mStandar, 'd' => $mShort, 'p' => $silver],
            ['b' => $mHighBudget, 's' => $mStandar, 'd' => $mReguler, 'p' => $gold],
            ['b' => $mHighBudget, 's' => $mStandar, 'd' => $mFullDay, 'p' => $platinum],
            ['b' => $mHighBudget, 's' => $mGrand, 'd' => $mShort, 'p' => $gold],
            ['b' => $mHighBudget, 's' => $mGrand, 'd' => $mReguler, 'p' => $platinum],
            ['b' => $mHighBudget, 's' => $mGrand, 'd' => $mFullDay, 'p' => $platinum],
        ];

        foreach ($rules as $r) {
            FuzzyRule::updateOrCreate(
                [
                    'budget_membership_id' => $r['b']->id,
                    'scale_membership_id' => $r['s']->id,
                    'duration_membership_id' => $r['d']->id,
                ],
                [
                    'recommended_package_id' => $r['p']->id,
                ]
            );
        }
    }
}

