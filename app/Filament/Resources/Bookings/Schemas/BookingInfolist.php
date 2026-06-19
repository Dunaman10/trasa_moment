<?php

namespace App\Filament\Resources\Bookings\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class BookingInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('booking_code'),
                TextEntry::make('customer_name'),
                TextEntry::make('customer_email'),
                TextEntry::make('customer_phone'),
                TextEntry::make('package.name')
                    ->label('Package'),
                TextEntry::make('event_date')
                    ->date(),
                TextEntry::make('booking_session'),
                TextEntry::make('event_location')
                    ->columnSpanFull(),
                TextEntry::make('latitude')
                    ->placeholder('-'),
                TextEntry::make('longitude')
                    ->placeholder('-'),
                TextEntry::make('special_notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('bank_destination'),
                TextEntry::make('status'),
                TextEntry::make('dp_amount')
                    ->numeric(),
                TextEntry::make('admin_fee')
                    ->numeric(),
                TextEntry::make('total_price')
                    ->money(),
                TextEntry::make('payment_proof_dp_path')
                    ->placeholder('-'),
                TextEntry::make('payment_proof_admin_path')
                    ->placeholder('-'),
                TextEntry::make('final_drive_link')
                    ->placeholder('-'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
