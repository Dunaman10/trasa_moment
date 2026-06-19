<?php

namespace App\Filament\Resources\FuzzyMemberships\Pages;

use App\Filament\Resources\FuzzyMemberships\FuzzyMembershipResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageFuzzyMemberships extends ManageRecords
{
    protected static string $resource = FuzzyMembershipResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
