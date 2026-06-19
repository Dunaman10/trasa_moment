<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\ChartWidget;

class BookingsStatusChart extends ChartWidget
{
    protected ?string $heading = 'Distribusi Status Pemesanan';
    
    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $statuses = Booking::statuses();
        $labels = [];
        $data = [];
        
        $colors = [
            Booking::STATUS_AWAITING_PAYMENT => '#eab308',
            Booking::STATUS_AWAITING_VERIFICATION => '#06b6d4',
            Booking::STATUS_SCHEDULED => '#10b981',
            Booking::STATUS_SHOOTING => '#3b82f6',
            Booking::STATUS_EDITING => '#8b5cf6',
            Booking::STATUS_COMPLETED => '#6b7280',
            Booking::STATUS_CANCELLED => '#ef4444',
        ];
        
        $bgColors = [];

        foreach ($statuses as $status) {
            $count = Booking::where('status', $status)->count();
            if ($count > 0) {
                $labels[] = Booking::statusLabels()[$status] ?? $status;
                $data[] = $count;
                $bgColors[] = $colors[$status] ?? '#9ca3af';
            }
        }

        if (empty($data)) {
            $labels[] = 'Belum Ada Booking';
            $data[] = 1;
            $bgColors[] = '#e5e7eb';
        }

        return [
            'datasets' => [
                [
                    'label' => 'Status Booking',
                    'data' => $data,
                    'backgroundColor' => $bgColors,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
