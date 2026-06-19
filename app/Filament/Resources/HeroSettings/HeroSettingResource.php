<?php

namespace App\Filament\Resources\HeroSettings;

use App\Filament\Resources\HeroSettings\Pages\ManageHeroSettings;
use App\Models\HeroSetting;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class HeroSettingResource extends Resource
{
  protected static ?string $model = HeroSetting::class;

  protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhoto;


  public static function getNavigationLabel(): string
  {
    return 'Beranda';
  }

  public static function getModelLabel(): string
  {
    return 'Beranda';
  }

  public static function getPluralModelLabel(): string
  {
    return 'Beranda';
  }

  public static function getNavigationGroup(): ?string
  {
    return 'Konten Landing Page';
  }

  public static function getNavigationSort(): ?int
  {
    return 1;
  }
  public static function canCreate(): bool
  {
    return false;
  }

  public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
  {
    return false;
  }

  public static function form(Schema $schema): Schema
  {
    return $schema
      ->components([
        TextInput::make('title')
          ->required()
          ->columnSpanFull(),
        Textarea::make('subtitle')
          ->required()
          ->columnSpanFull(),
        FileUpload::make('image_path_1')
          ->label('Foto Utama (Kiri Atas)')
          ->image()
          ->disk('public')
          ->visibility('public')
          ->required(),
        FileUpload::make('image_path_2')
          ->label('Foto Kanan (Kanan Atas)')
          ->image()
          ->disk('public')
          ->visibility('public')
          ->required(),
        FileUpload::make('image_path_3')
          ->label('Foto Studio (Kiri Bawah)')
          ->image()
          ->disk('public')
          ->visibility('public')
          ->required(),
        FileUpload::make('image_path_4')
          ->label('Foto Outdoor (Kanan Bawah)')
          ->image()
          ->disk('public')
          ->visibility('public')
          ->required(),
      ]);
  }

  public static function table(Table $table): Table
  {
    return $table
      ->columns([
        TextColumn::make('title')
          ->label('Judul')
          ->searchable(),
        // ImageColumn::make('image_path_1')
        //   ->label('Foto 1'),
        // ImageColumn::make('image_path_2')
        //   ->label('Foto 2'),
        // ImageColumn::make('image_path_3')
        //   ->label('Foto 3'),
        // ImageColumn::make('image_path_4')
        //   ->label('Foto 4'),
        TextColumn::make('updated_at')
          ->label('Diperbarui Pada')
          ->dateTime()
          ->sortable(),
      ])
      ->filters([
        //
      ])
      ->recordActions([
        EditAction::make()
          ->modalSubmitActionLabel('Simpan')
          ->modalCancelActionLabel('Batal'),
      ])
      ->toolbarActions([
        //
      ]);
  }

  public static function getPages(): array
  {
    return [
      'index' => ManageHeroSettings::route('/'),
    ];
  }
}
