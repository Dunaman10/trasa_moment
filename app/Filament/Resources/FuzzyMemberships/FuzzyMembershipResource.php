<?php

namespace App\Filament\Resources\FuzzyMemberships;

use App\Filament\Resources\FuzzyMemberships\Pages\ManageFuzzyMemberships;
use App\Models\FuzzyMembership;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FuzzyMembershipResource extends Resource
{
    protected static ?string $model = FuzzyMembership::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChartBar;


    public static function getNavigationLabel(): string
    {
        return 'Fungsi Keanggotaan';
    }

    public static function getNavigationGroup(): ?string
    {
        return 'Mesin Fuzzy Logic';
    }

    public static function getNavigationSort(): ?int
    {
        return 2;
    }
    protected static ?string $recordTitleAttribute = 'label';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('variable_id')
                    ->relationship('variable', 'name')
                    ->required(),
                TextInput::make('label')
                    ->required(),
                TextInput::make('point_a')
                    ->required()
                    ->numeric(),
                TextInput::make('point_b')
                    ->required()
                    ->numeric(),
                TextInput::make('point_c')
                    ->required()
                    ->numeric(),
                TextInput::make('point_d')
                    ->required()
                    ->numeric(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('label')
            ->columns([
                TextColumn::make('variable.name')
                    ->searchable(),
                TextColumn::make('label')
                    ->searchable(),
                TextColumn::make('point_a')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('point_b')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('point_c')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('point_d')
                    ->numeric()
                    ->sortable(),
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
            'index' => ManageFuzzyMemberships::route('/'),
        ];
    }
}
