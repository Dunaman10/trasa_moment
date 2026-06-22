<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Livewire\Attributes\On;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    #[On('echo:bookings,BookingSubmitted')]
    public function refreshStats()
    {
        // Re-renders the widget
    }

    protected function getStats(): array
    {
        $totalBookings = Booking::count();
        
        $revenue = Booking::whereIn('status', [
            Booking::STATUS_SCHEDULED,
            Booking::STATUS_SHOOTING,
            Booking::STATUS_EDITING,
            Booking::STATUS_COMPLETED
        ])->sum('total_price');

        $pendingVerification = Booking::where('status', Booking::STATUS_AWAITING_VERIFICATION)->count();

        return [
            Stat::make('Total Pemesanan', $totalBookings)
                ->description('Semua status pemesanan')
                ->descriptionIcon('heroicon-m-clipboard-document-list')
                ->color('info'),
            Stat::make('Total Pendapatan', 'Rp ' . number_format($revenue, 0, ',', '.'))
                ->description('Pemesanan dikonfirmasi & selesai')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
            Stat::make('Menunggu Verifikasi', $pendingVerification)
                ->description('Perlu verifikasi bukti transfer')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingVerification > 0 ? 'warning' : 'gray'),
        ];
    }
}
