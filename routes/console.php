<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\Booking;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    $expiredCount = Booking::where('status', Booking::STATUS_AWAITING_PAYMENT)
        ->where('created_at', '<=', now()->subMinutes(60))
        ->update(['status' => Booking::STATUS_CANCELLED]);

    if ($expiredCount > 0) {
        logger("Auto-expired {$expiredCount} bookings.");
    }
})->everyMinute();

