<?php

namespace App\Filament\Resources\Bookings\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Schema;
use App\Models\Booking;
use Hugomyb\FilamentMediaAction\Actions\MediaAction;

class BookingInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(12)
            ->components([
                // Left Column (ColSpan 7) - Customer info & Event Details
                Group::make([
                    Section::make('Informasi Pelanggan')
                        ->description('Detail data diri pelanggan yang melakukan reservasi.')
                        ->icon('heroicon-o-user')
                        ->schema([
                            Grid::make(2)
                                ->schema([
                                    TextEntry::make('customer_name')
                                        ->label('Nama Lengkap')
                                        ->weight('bold'),
                                    TextEntry::make('customer_phone')
                                        ->label('Nomor WhatsApp')
                                        ->copyable()
                                        ->icon('heroicon-o-phone')
                                        ->color('primary'),
                                    TextEntry::make('customer_email')
                                        ->label('Alamat Email')
                                        ->icon('heroicon-o-envelope')
                                        ->columnSpanFull(),
                                ]),
                        ]),

                    Section::make('Jadwal & Lokasi Acara')
                        ->description('Detail jadwal pelaksanaan sesi pemotretan serta koordinat lokasi.')
                        ->icon('heroicon-o-calendar-days')
                        ->schema([
                            Grid::make(2)
                                ->schema([
                                    TextEntry::make('package.name')
                                        ->label('Paket Layanan')
                                        ->weight('bold')
                                        ->color('primary'),
                                    TextEntry::make('event_date')
                                        ->label('Tanggal Acara')
                                        ->date('d F Y'),
                                    TextEntry::make('booking_session')
                                        ->label('Sesi Waktu')
                                        ->formatStateUsing(fn(string $state): string => match (strtolower($state)) {
                                            'pagi' => 'Sesi Pagi (09:00 - 12:00)',
                                            'siang' => 'Sesi Siang (13:00 - 16:00)',
                                            'sore' => 'Sesi Sore/Malam (17:00 - 20:00)',
                                            default => $state,
                                        })
                                        ->columnSpanFull(),
                                    TextEntry::make('event_location')
                                        ->label('Alamat Lengkap Lokasi')
                                        ->columnSpanFull(),
                                    TextEntry::make('latitude')
                                        ->label('Latitude')
                                        ->placeholder('-'),
                                    TextEntry::make('longitude')
                                        ->label('Longitude')
                                        ->placeholder('-'),
                                    TextEntry::make('special_notes')
                                        ->label('Catatan Khusus / Request')
                                        ->placeholder('-')
                                        ->columnSpanFull(),
                                ]),
                        ]),
                ])->columnSpan(7),

                // Right Column (ColSpan 5) - Status & Finance details
                Group::make([
                    Section::make('Status & Rincian Pembayaran')
                        ->description('Status booking dan detail biaya transaksi.')
                        ->icon('heroicon-o-credit-card')
                        ->schema([
                            Grid::make(2)
                                ->schema([
                                    TextEntry::make('booking_code')
                                        ->label('Kode Booking')
                                        ->copyable()
                                        ->weight('bold')
                                        ->color('primary')
                                        ->columnSpanFull(),
                                    TextEntry::make('status')
                                        ->label('Status Pemesanan')
                                        ->badge()
                                        ->color(fn(string $state): string => match ($state) {
                                            Booking::STATUS_AWAITING_PAYMENT => 'warning',
                                            Booking::STATUS_AWAITING_VERIFICATION => 'info',
                                            Booking::STATUS_SCHEDULED => 'success',
                                            Booking::STATUS_COMPLETED => 'gray',
                                            Booking::STATUS_CANCELLED => 'danger',
                                            default => 'gray',
                                        })
                                        ->formatStateUsing(fn(string $state): string => Booking::statusLabels()[$state] ?? $state),
                                    TextEntry::make('bank_destination')
                                        ->label('Bank Tujuan')
                                        ->formatStateUsing(fn(string $state) => strtoupper($state)),
                                    TextEntry::make('dp_amount')
                                        ->label('Uang Muka (DP)')
                                        ->money('IDR', locale: 'id-ID'),
                                    TextEntry::make('admin_fee')
                                        ->label('Biaya Admin QRIS')
                                        ->money('IDR', locale: 'id-ID'),
                                    TextEntry::make('total_price')
                                        ->label('Total Harga Paket')
                                        ->money('IDR', locale: 'id-ID')
                                        ->weight('extrabold')
                                        ->color('success')
                                        ->columnSpanFull(),
                                    TextEntry::make('final_drive_link')
                                        ->label('Link Google Drive Hasil Foto')
                                        ->placeholder('-')
                                        ->url(fn ($state) => $state, true)
                                        ->color('primary')
                                        ->icon('heroicon-o-link')
                                        ->columnSpanFull(),
                                ]),
                        ]),
                ])->columnSpan(5),

                // Full Width Column - Bukti Transfer (Visual)
                Section::make('Bukti Pembayaran (Transfer)')
                    ->description('Visual bukti transfer yang diunggah oleh pelanggan. Klik pada gambar untuk memperbesar.')
                    ->icon('heroicon-o-photo')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                ImageEntry::make('payment_proof_dp_path')
                                    ->label('Bukti Down Payment (DP)')
                                    ->disk('public')
                                    ->placeholder('Belum ada bukti bayar DP')
                                    ->action(
                                        MediaAction::make('preview_bukti_dp')
                                            ->label('Preview Bukti DP')
                                            ->media(
                                                fn(Booking $record): ?string => $record->payment_proof_dp_path
                                                    ? asset('storage/' . $record->payment_proof_dp_path)
                                                    : null
                                            )
                                            ->mediaType(MediaAction::TYPE_IMAGE)
                                            ->extraModalActions([
                                                \Filament\Actions\Action::make('download_dp')
                                                    ->label('Unduh Gambar')
                                                    ->icon('heroicon-o-arrow-down-tray')
                                                    ->color('success')
                                                    ->url(fn(Booking $record) => asset('storage/' . $record->payment_proof_dp_path))
                                                    ->extraAttributes([
                                                        'download' => '',
                                                    ])
                                            ])
                                    ),
                                ImageEntry::make('payment_proof_admin_path')
                                    ->label('Bukti Biaya Admin')
                                    ->disk('public')
                                    ->placeholder('Belum ada bukti bayar Admin')
                                    ->action(
                                        MediaAction::make('preview_bukti_admin')
                                            ->label('Preview Bukti Admin')
                                            ->media(
                                                fn(Booking $record): ?string => $record->payment_proof_admin_path
                                                    ? asset('storage/' . $record->payment_proof_admin_path)
                                                    : null
                                            )
                                            ->mediaType(MediaAction::TYPE_IMAGE)
                                            ->extraModalActions([
                                                \Filament\Actions\Action::make('download_admin')
                                                    ->label('Unduh Gambar')
                                                    ->icon('heroicon-o-arrow-down-tray')
                                                    ->color('success')
                                                    ->url(fn(Booking $record) => asset('storage/' . $record->payment_proof_admin_path))
                                                    ->extraAttributes([
                                                        'download' => '',
                                                    ])
                                            ])
                                    ),
                            ]),
                    ])
                    ->columnSpanFull()
                    ->collapsible(),
            ]);
    }
}
