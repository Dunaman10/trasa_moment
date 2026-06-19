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

class BookingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('booking_code')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('customer_name')
                    ->searchable(),
                TextColumn::make('customer_phone')
                    ->label('WhatsApp')
                    ->searchable(),
                TextColumn::make('package.name')
                    ->searchable(),
                TextColumn::make('event_date')
                    ->date()
                    ->sortable(),
                TextColumn::make('booking_session')
                    ->searchable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        Booking::STATUS_AWAITING_PAYMENT => 'warning',
                        Booking::STATUS_AWAITING_VERIFICATION => 'info',
                        Booking::STATUS_SCHEDULED => 'success',
                        Booking::STATUS_COMPLETED => 'gray',
                        Booking::STATUS_CANCELLED => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => Booking::statusLabels()[$state] ?? $state)
                    ->searchable(),
                TextColumn::make('total_price')
                    ->money('IDR', locale: 'id-ID')
                    ->sortable(),
                ImageColumn::make('payment_proof_dp_path')
                    ->label('Bukti DP')
                    ->square()
                    ->disk('public'),
                ImageColumn::make('payment_proof_admin_path')
                    ->label('Bukti Admin')
                    ->square()
                    ->disk('public'),
                TextColumn::make('final_drive_link')
                    ->label('Drive Link')
                    ->limit(20)
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
                
                Action::make('approve_dp')
                    ->label('Setujui DP')
                    ->color('success')
                    ->icon('heroicon-o-check-circle')
                    ->visible(fn (Booking $record): bool => in_array($record->status, [Booking::STATUS_AWAITING_PAYMENT, Booking::STATUS_AWAITING_VERIFICATION]))
                    ->action(fn (Booking $record) => $record->update(['status' => Booking::STATUS_SCHEDULED])),

                Action::make('reject_dp')
                    ->label('Tolak DP')
                    ->color('danger')
                    ->icon('heroicon-o-x-circle')
                    ->visible(fn (Booking $record): bool => $record->status === Booking::STATUS_AWAITING_VERIFICATION)
                    ->action(fn (Booking $record) => $record->update(['status' => Booking::STATUS_AWAITING_PAYMENT])),

                Action::make('complete_booking')
                    ->label('Selesai & Drive')
                    ->color('info')
                    ->icon('heroicon-o-check')
                    ->form([
                        TextInput::make('final_drive_link')
                            ->label('Link Google Drive Hasil Foto')
                            ->required()
                            ->url(),
                    ])
                    ->visible(fn (Booking $record): bool => in_array($record->status, [Booking::STATUS_SCHEDULED, 'shooting', 'editing']))
                    ->action(fn (Booking $record, array $data) => $record->update([
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
