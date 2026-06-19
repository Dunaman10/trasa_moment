<?php

namespace App\Filament\Resources\Bookings;


use App\Filament\Resources\Bookings\Pages\EditBooking;
use App\Filament\Resources\Bookings\Pages\ListBookings;
use App\Filament\Resources\Bookings\Pages\ViewBooking;
use App\Filament\Resources\Bookings\Schemas\BookingForm;
use App\Filament\Resources\Bookings\Schemas\BookingInfolist;
use App\Filament\Resources\Bookings\Tables\BookingsTable;
use App\Models\Booking;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BookingResource extends Resource
{
  protected static ?string $model = Booking::class;

  protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;

  protected static ?string $recordTitleAttribute = 'booking_code';

  protected static ?string $modelLabel = 'Data Booking';

  protected static ?string $pluralModelLabel = 'Data Booking';

  protected static ?string $label = 'Data Booking';

  public static function getNavigationLabel(): string
  {
    return 'Data Booking';
  }

  public static function getNavigationGroup(): ?string
  {
    return 'Manajemen Pemesanan';
  }

  public static function getNavigationSort(): ?int
  {
    return 1;
  }

  public static function form(Schema $schema): Schema
  {
    return BookingForm::configure($schema);
  }

  public static function infolist(Schema $schema): Schema
  {
    return BookingInfolist::configure($schema);
  }

  public static function table(Table $table): Table
  {
    return BookingsTable::configure($table);
  }

  public static function getRelations(): array
  {
    return [
      //
    ];
  }

  public static function getPages(): array
  {
    return [
      'index' => ListBookings::route('/'),
      'view' => ViewBooking::route('/{record}'),
      // 'edit' => EditBooking::route('/{record}/edit'),
    ];
  }
}
