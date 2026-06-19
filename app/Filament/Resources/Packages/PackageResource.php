<?php

namespace App\Filament\Resources\Packages;

use App\Filament\Resources\Packages\Pages\ManagePackages;
use App\Models\Package;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PackageResource extends Resource
{
  protected static ?string $model = Package::class;

  protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedArchiveBox;
  protected static ?string $modelLabel = 'Paket';
  protected static ?string $pluralModelLabel = 'Paket Layanan';



  public static function getNavigationLabel(): string
  {
    return 'Paket Layanan';
  }

  public static function getNavigationGroup(): ?string
  {
    return 'Manajemen Pemesanan';
  }

  public static function getNavigationSort(): ?int
  {
    return 2;
  }
  protected static ?string $recordTitleAttribute = 'name';

  public static function form(Schema $schema): Schema
  {
    return $schema
      ->components([
        TextInput::make('name')
          ->label('Nama Paket')
          ->required()
          ->columnSpanFull(),
        Textarea::make('description')
          ->label('Deskripsi')
          ->required()
          ->columnSpanFull(),
        TextInput::make('base_price')
          ->label('Harga')
          ->required()
          ->numeric()
          ->prefix('Rp'),

        TextInput::make('duration_hours')
          ->label('Durasi (jam)')
          ->required()
          ->numeric(),
        Toggle::make('is_active')
          ->label('Status')
          ->required(),
      ]);
  }

  public static function table(Table $table): Table
  {
    return $table
      ->recordTitleAttribute('name')
      ->columns([
        TextColumn::make('name')
          ->label('Nama Paket')
          ->searchable(),
        TextColumn::make('base_price')
          ->label('Harga')
          ->money('IDR')
          ->sortable(),
        TextColumn::make('duration_hours')
          ->label('Durasi (jam)')
          ->numeric()
          ->sortable(),
        IconColumn::make('is_active')
          ->label('Status')
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
        EditAction::make()
          ->modalHeading(fn (Package $record) => "Edit Paket: {$record->name}")
          ->modalSubmitActionLabel('Simpan Perubahan')
          ->modalCancelActionLabel('Batal'),
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
      'index' => ManagePackages::route('/'),
    ];
  }
}
