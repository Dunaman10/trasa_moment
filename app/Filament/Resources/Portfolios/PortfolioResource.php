<?php

namespace App\Filament\Resources\Portfolios;

use App\Filament\Resources\Portfolios\Pages\ManagePortfolios;
use App\Models\Portfolio;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PortfolioResource extends Resource
{
    protected static ?string $model = Portfolio::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCamera;


    public static function getNavigationLabel(): string
    {
        return 'Galeri Portfolio';
    }

    public static function getNavigationGroup(): ?string
    {
        return 'Konten Landing Page';
    }

    public static function getNavigationSort(): ?int
    {
        return 2;
    }
    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('category')
                    ->required(),
                FileUpload::make('image_path')
                    ->image()
                    ->required(),
                TextInput::make('display_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_featured')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                TextColumn::make('title')
                    ->searchable(),
                TextColumn::make('category')
                    ->searchable(),
                ImageColumn::make('image_path'),
                TextColumn::make('display_order')
                    ->numeric()
                    ->sortable(),
                IconColumn::make('is_featured')
                    ->boolean(),
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
            'index' => ManagePortfolios::route('/'),
        ];
    }
}
