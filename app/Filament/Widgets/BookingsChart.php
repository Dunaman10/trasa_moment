<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\ChartWidget;
use Carbon\Carbon;
use Livewire\Attributes\On;

class BookingsChart extends ChartWidget
{
    protected ?string $heading = 'Tren Pemesanan (12 Bulan Terakhir)';
    
    protected static ?int $sort = 2;

    #[On('echo:bookings,BookingSubmitted')]
    public function refreshChart()
    {
        // Re-renders the widget
    }

    protected function getData(): array
    {
        $data = [];
        $labels = [];
        
        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $labels[] = $month->format('M Y');
            
            $count = Booking::whereYear('event_date', $month->year)
                ->whereMonth('event_date', $month->month)
                ->count();
            
            $data[] = $count;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Jumlah Booking',
                    'data' => $data,
                    'borderColor' => '#3b82f6',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                    'fill' => 'start',
                    'tension' => 0.3,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
