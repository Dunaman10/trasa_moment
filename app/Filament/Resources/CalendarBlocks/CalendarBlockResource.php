<?php

namespace App\Filament\Resources\CalendarBlocks;

use App\Filament\Resources\CalendarBlocks\Pages\ManageCalendarBlocks;
use App\Models\CalendarBlock;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CalendarBlockResource extends Resource
{
    protected static ?string $model = CalendarBlock::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendarDays;


    public static function getNavigationLabel(): string
    {
        return 'Blokir Kalender';
    }

    public static function getNavigationGroup(): ?string
    {
        return 'Manajemen Pemesanan';
    }

    public static function getNavigationSort(): ?int
    {
        return 3;
    }
    protected static ?string $recordTitleAttribute = 'block_date';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                DatePicker::make('block_date')
                    ->label('Tanggal yang Diblokir')
                    ->placeholder('Pilih tanggal...')
                    ->helperText('Pilih tanggal di mana studio libur atau tidak menerima sesi foto. Seluruh slot (pagi, siang, sore) pada tanggal ini akan ditutup di kalender pelanggan.')
                    ->required()
                    ->native(false)
                    ->displayFormat('d F Y'),
                TextInput::make('title')
                    ->label('Keterangan / Alasan Blokir')
                    ->placeholder('Contoh: Libur Nasional / Cuti Bersama / Maintenance Studio')
                    ->helperText('Catatan alasan mengapa tanggal ini diblokir (opsional).')
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('block_date')
            ->columns([
                TextColumn::make('block_date')
                    ->label('Tanggal Diblokir')
                    ->date('d F Y')
                    ->sortable(),
                TextColumn::make('title')
                    ->label('Alasan / Keterangan')
                    ->placeholder('Tanpa keterangan')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->label('Diperbarui Pada')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make()
                    ->modalHeading('Edit Blokir Tanggal')
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
            'index' => ManageCalendarBlocks::route('/'),
        ];
    }
}
