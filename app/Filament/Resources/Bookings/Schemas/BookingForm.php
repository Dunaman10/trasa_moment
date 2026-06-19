<?php

namespace App\Filament\Resources\Bookings\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class BookingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('booking_code')
                    ->required(),
                TextInput::make('customer_name')
                    ->required(),
                TextInput::make('customer_email')
                    ->email()
                    ->required(),
                TextInput::make('customer_phone')
                    ->tel()
                    ->required(),
                Select::make('package_id')
                    ->relationship('package', 'name')
                    ->required(),
                DatePicker::make('event_date')
                    ->required(),
                TextInput::make('booking_session')
                    ->required(),
                Textarea::make('event_location')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('latitude'),
                TextInput::make('longitude'),
                Textarea::make('special_notes')
                    ->columnSpanFull(),
                TextInput::make('bank_destination')
                    ->required(),
                TextInput::make('status')
                    ->required()
                    ->default('awaiting_payment'),
                TextInput::make('dp_amount')
                    ->required()
                    ->numeric(),
                TextInput::make('admin_fee')
                    ->required()
                    ->numeric()
                    ->default(5000.0),
                TextInput::make('total_price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('payment_proof_dp_path'),
                TextInput::make('payment_proof_admin_path'),
                TextInput::make('final_drive_link'),
            ]);
    }
}
