<?php

namespace App\Filament\Resources\FuzzyVariables\Pages;

use App\Filament\Resources\FuzzyVariables\FuzzyVariableResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageFuzzyVariables extends ManageRecords
{
    protected static string $resource = FuzzyVariableResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
