<?php

namespace App\Filament\Resources\HeroSettings\Pages;

use App\Filament\Resources\HeroSettings\HeroSettingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\EditRecord;

class ManageHeroSettings extends EditRecord
{
    protected static string $resource = HeroSettingResource::class;

    public function mount($record = null): void
    {
        $hero = \App\Models\HeroSetting::first();
        if (!$hero) {
            $hero = \App\Models\HeroSetting::create([
                'title' => 'Abadikan Setiap Momen Berharga Bersama Kami',
                'subtitle' => 'Penyedia jasa fotografi & videografi profesional dengan rekomendasi paket berbasis kecerdasan buatan.',
                'image_path_1' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
                'image_path_2' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
                'image_path_3' => 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600',
                'image_path_4' => 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600',
            ]);
        }

        parent::mount($hero->getKey());
    }

    protected function getHeaderActions(): array
    {
        return [];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
