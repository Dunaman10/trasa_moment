<?php

namespace App\Filament\Resources\LandingPageSettings\Pages;

use App\Filament\Resources\LandingPageSettings\LandingPageSettingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageLandingPageSettings extends ManageRecords
{
    protected static string $resource = LandingPageSettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
