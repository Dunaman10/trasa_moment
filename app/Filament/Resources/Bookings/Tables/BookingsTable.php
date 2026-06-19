<?php

namespace App\Filament\Resources\Bookings\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Table;
use App\Models\Booking;
use Hugomyb\FilamentMediaAction\Actions\MediaAction;


class BookingsTable
{
  public static function configure(Table $table): Table
  {
    return $table
      ->columns([
        // TextColumn::make('booking_code')
        //   ->label('Kode Booking')
        //   ->searchable()
        //   ->copyable(),
        TextColumn::make('customer_name')
          ->label('Nama Pelanggan')
          ->searchable(),
        // TextColumn::make('customer_phone')
        //   ->label('WhatsApp')
        //   ->searchable(),
        // TextColumn::make('package.name')
        //   ->label('Paket')
        //   ->searchable(),
        // TextColumn::make('event_date')
        //   ->label('Tanggal Acara')
        //   ->date()
        //   ->sortable(),
        // TextColumn::make('booking_session')
        //   ->label('Sesi')
        //   ->formatStateUsing(fn(string $state): string => match (strtolower($state)) {
        //     'pagi' => 'Sesi Pagi (09:00 - 12:00)',
        //     'siang' => 'Sesi Siang (13:00 - 16:00)',
        //     'sore' => 'Sesi Sore/Malam (17:00 - 20:00)',
        //     default => $state,
        //   })
        //   ->searchable(),
        TextColumn::make('status')
          ->badge()
          ->color(fn(string $state): string => match ($state) {
            Booking::STATUS_AWAITING_PAYMENT => 'warning',
            Booking::STATUS_AWAITING_VERIFICATION => 'info',
            Booking::STATUS_SCHEDULED => 'success',
            Booking::STATUS_COMPLETED => 'gray',
            Booking::STATUS_CANCELLED => 'danger',
            default => 'gray',
          })
          ->formatStateUsing(fn(string $state): string => Booking::statusLabels()[$state] ?? $state)
          ->searchable(),
        // TextColumn::make('total_price')
        //   ->label('Total Harga')
        //   ->money('IDR', locale: 'id-ID')
        //   ->sortable(),
        TextColumn::make('payment_proof_dp_path')
          ->label('Bukti DP')
          ->icon(fn($state) => $state ? 'heroicon-o-photo' : null)
          ->iconColor('primary')
          ->color('primary')
          ->formatStateUsing(fn($state) => $state ? '' : '-')
          ->alignCenter()
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
        TextColumn::make('payment_proof_admin_path')
          ->label('Bukti Admin')
          ->icon(fn($state) => $state ? 'heroicon-o-photo' : null)
          ->iconColor('primary')
          ->color('primary')
          ->formatStateUsing(fn($state) => $state ? '' : '-')
          ->alignCenter()
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

        // TextColumn::make('final_drive_link')
        //   ->label('Drive Link')
        //   ->limit(20)
        //   ->searchable(),
        TextColumn::make('created_at')
          ->label('Dibuat Pada')
          ->dateTime()
          ->sortable()
          ->toggleable(isToggledHiddenByDefault: true),
      ])
      ->filters([
        //
      ])
      ->actions([
        ViewAction::make(),
        // EditAction::make(),

        Action::make('approve_dp')
          ->label('Setujui DP')
          ->color('success')
          ->icon('heroicon-o-check-circle')
          ->visible(fn(Booking $record): bool => in_array($record->status, [Booking::STATUS_AWAITING_PAYMENT, Booking::STATUS_AWAITING_VERIFICATION]))
          ->action(fn(Booking $record) => $record->update(['status' => Booking::STATUS_SCHEDULED])),

        Action::make('reject_dp')
          ->label('Tolak DP')
          ->color('danger')
          ->icon('heroicon-o-x-circle')
          ->visible(fn(Booking $record): bool => $record->status === Booking::STATUS_AWAITING_VERIFICATION)
          ->action(fn(Booking $record) => $record->update(['status' => Booking::STATUS_AWAITING_PAYMENT])),

        Action::make('complete_booking')
          ->label('Selesai & Kirim Link Drive')
          ->color('info')
          ->icon('heroicon-o-check')
          ->form([
            TextInput::make('final_drive_link')
              ->label('Link Google Drive Hasil Foto')
              ->required()
              ->url(),
          ])
          ->visible(fn(Booking $record): bool => in_array($record->status, [Booking::STATUS_SCHEDULED, 'shooting', 'editing']))
          ->action(fn(Booking $record, array $data) => $record->update([
            'status' => Booking::STATUS_COMPLETED,
            'final_drive_link' => $data['final_drive_link']
          ])),
      ])
      ->bulkActions([
        BulkActionGroup::make([
          DeleteBulkAction::make(),
        ]),
      ]);
  }
}
