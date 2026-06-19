<?php

namespace App\Filament\Resources\HeroSettings\Pages;

use App\Filament\Resources\HeroSettings\HeroSettingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageHeroSettings extends ManageRecords
{
    protected static string $resource = HeroSettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
