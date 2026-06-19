<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {
    Route::get('/landing-data', [ApiController::class, 'getLandingData']);
    Route::get('/calendar/availability', [ApiController::class, 'getCalendarAvailability']);
    Route::post('/checkout', [ApiController::class, 'checkout']);
    Route::get('/tracking/{code}', [ApiController::class, 'getTrackingDetails']);
    Route::post('/tracking/{code}/reupload', [ApiController::class, 'reuploadPaymentProof']);
});

