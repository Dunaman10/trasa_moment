<?php

namespace App\Filament\Resources\FuzzyRules;

use App\Filament\Resources\FuzzyRules\Pages\ManageFuzzyRules;
use App\Models\FuzzyRule;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FuzzyRuleResource extends Resource
{
    protected static ?string $model = FuzzyRule::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCpuChip;


    public static function getNavigationLabel(): string
    {
        return 'Aturan Fuzzy (Rules)';
    }

    public static function getNavigationGroup(): ?string
    {
        return 'Mesin Fuzzy Logic';
    }

    public static function getNavigationSort(): ?int
    {
        return 3;
    }
    protected static ?string $recordTitleAttribute = 'id';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('budget_membership_id')
                    ->relationship('budgetMembership', 'label')
                    ->required()
                    ->label('Kondisi Budget'),
                Select::make('scale_membership_id')
                    ->relationship('scaleMembership', 'label')
                    ->required()
                    ->label('Kondisi Skala'),
                Select::make('duration_membership_id')
                    ->relationship('durationMembership', 'label')
                    ->required()
                    ->label('Kondisi Durasi'),
                Select::make('recommended_package_id')
                    ->relationship('recommendedPackage', 'name')
                    ->required()
                    ->label('Paket yang Direkomendasikan'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->columns([
                TextColumn::make('budgetMembership.label')
                    ->label('Budget')
                    ->searchable(),
                TextColumn::make('scaleMembership.label')
                    ->label('Skala')
                    ->searchable(),
                TextColumn::make('durationMembership.label')
                    ->label('Durasi')
                    ->searchable(),
                TextColumn::make('recommendedPackage.name')
                    ->label('Paket Output')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageFuzzyRules::route('/'),
        ];
    }
}
