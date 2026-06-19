<?php

namespace App\Filament\Resources\FuzzyRules\Pages;

use App\Filament\Resources\FuzzyRules\FuzzyRuleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageFuzzyRules extends ManageRecords
{
    protected static string $resource = FuzzyRuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
