<?php

namespace App\Filament\Resources\CalendarBlocks\Pages;

use App\Filament\Resources\CalendarBlocks\CalendarBlockResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageCalendarBlocks extends ManageRecords
{
    protected static string $resource = CalendarBlockResource::class;

    public function getHeading(): string
    {
        return 'Blokir Kalender (Hari Libur / Penuh)';
    }

    public function getSubheading(): ?string
    {
        return 'Kelola tanggal libur studio atau tanggal khusus yang ingin Anda tutup secara penuh. Semua tanggal yang terdaftar di sini otomatis tidak dapat dipilih oleh pelanggan di halaman jadwal frontend.';
    }

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('Blokir Tanggal')
                ->modalHeading('Buat Blokir Tanggal')
                ->modalSubmitActionLabel('Blokir')
                ->createAnother(false)
                ->modalCancelActionLabel('Batal'),
        ];
    }
}
