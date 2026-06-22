<?php

namespace App\Filament\Resources\Bookings\Pages;

use App\Filament\Resources\Bookings\BookingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Livewire\Attributes\On;

class ListBookings extends ListRecords
{
    protected static string $resource = BookingResource::class;

    #[On('echo:bookings,BookingSubmitted')]
    public function refreshBookings()
    {
        // Re-renders the component to show new data
    }

    protected function getHeaderActions(): array
    {
        return [
            //
        ];
    }
}
