<?php

namespace App\Filament\Resources\Testimonials;

use App\Filament\Resources\Testimonials\Pages\ManageTestimonials;
use App\Models\Testimonial;
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

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftEllipsis;


    public static function getNavigationLabel(): string
    {
        return 'Testimoni Klien';
    }

    public static function getNavigationGroup(): ?string
    {
        return 'Konten Landing Page';
    }

    public static function getNavigationSort(): ?int
    {
        return 3;
    }
    public static function getModelLabel(): string
    {
        return 'Testimoni';
    }

    public static function getPluralModelLabel(): string
    {
        return 'Testimoni';
    }

    protected static ?string $recordTitleAttribute = 'client_name';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                TextInput::make('client_name')
                    ->label('Nama Klien')
                    ->required(),
                \Filament\Forms\Components\SpatieMediaLibraryFileUpload::make('avatar')
                    ->label('Foto Klien (Avatar)')
                    ->collection('avatar')
                    ->image()
                    ->disk('public')
                    ->visibility('public')
                    ->required(),
                \Filament\Forms\Components\Select::make('event_category')
                    ->label('Kategori Acara')
                    ->options([
                        'wedding' => 'Pernikahan (Wedding)',
                        'graduation' => 'Wisuda (Graduation)',
                        'personal' => 'Sesi Personal',
                        'event' => 'Acara (Event)',
                    ])
                    ->required(),
                Textarea::make('review_text')
                    ->label('Ulasan / Testimoni')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('rating')
                    ->label('Rating')
                    ->required()
                    ->numeric()
                    ->default(5)
                    ->minValue(1)
                    ->maxValue(5),
                Toggle::make('is_visible')
                    ->label('Perlihatkan')
                    ->default(true)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('client_name')
            ->defaultSort('created_at', 'desc')
            ->columns([
                \Filament\Tables\Columns\SpatieMediaLibraryImageColumn::make('avatar')
                    ->label('Foto Klien')
                    ->collection('avatar')
                    ->circular(),
                TextColumn::make('client_name')
                    ->label('Nama Klien')
                    ->searchable(),
                TextColumn::make('event_category')
                    ->label('Kategori Acara')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'wedding' => 'Pernikahan (Wedding)',
                        'graduation' => 'Wisuda (Graduation)',
                        'personal' => 'Sesi Personal',
                        'event' => 'Acara (Event)',
                        default => $state,
                    })
                    ->searchable(),
                TextColumn::make('rating')
                    ->label('Rating')
                    ->numeric()
                    ->sortable(),
                IconColumn::make('is_visible')
                    ->label('Perlihatkan')
                    ->boolean(),
                TextColumn::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->label('Diperbarui Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make()
                    ->modalSubmitActionLabel('Simpan')
                    ->modalCancelActionLabel('Batal'),
                DeleteAction::make()
                    ->modalCancelActionLabel('Batal'),
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
            'index' => ManageTestimonials::route('/'),
        ];
    }
}
