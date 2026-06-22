<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Package;
use App\Models\Portfolio;
use App\Models\Testimonial;
use App\Models\HeroSetting;
use App\Models\CalendarBlock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ApiController extends Controller
{
    /**
     * Get all data needed for the landing page.
     */
    public function getLandingData()
    {
        return response()->json([
            'hero' => HeroSetting::current(),
            'portfolios' => Portfolio::ordered()->get(),
            'testimonials' => Testimonial::visible()->ordered()->get(),
            'packages' => Package::active()->get()->map(function ($pkg) {
                return [
                    'id' => $pkg->id,
                    'name' => $pkg->name,
                    'description' => $pkg->description,
                    'base_price' => $pkg->base_price,
                    'duration_hours' => $pkg->duration_hours,
                    'dp_amount' => $pkg->dp_amount,
                    'formatted_price' => $pkg->formatted_price,
                ];
            }),
            'settings' => [
                'whatsapp_number' => config('trasa.settings.whatsapp_number'),
                'instagram_username' => config('trasa.settings.instagram_username'),
                'office_address' => config('trasa.settings.office_address'),
                'account_name' => config('trasa.settings.account_name'),
                'bca_account_number' => config('trasa.settings.bca_account_number'),
                'mandiri_account_number' => config('trasa.settings.mandiri_account_number'),
                'qris_image_path' => config('trasa.settings.qris_image_path'),
            ]
        ]);
    }

    /**
     * Get monthly calendar availability slots.
     */
    public function getCalendarAvailability(Request $request)
    {
        $year = $request->query('year', now()->year);
        $month = $request->query('month', now()->month);

        // Ambil data block libur/penuh
        $blocks = CalendarBlock::whereYear('block_date', $year)
            ->whereMonth('block_date', $month)
            ->get(['block_date', 'title']);

        // Ambil data booking aktif pada bulan & tahun tersebut
        $bookings = Booking::whereYear('event_date', $year)
            ->whereMonth('event_date', $month)
            ->whereNotIn('status', [Booking::STATUS_CANCELLED])
            ->get(['event_date', 'booking_session', 'status']);

        return response()->json([
            'blocks' => $blocks->map(function ($b) {
                return [
                    'date' => $b->block_date->format('Y-m-d'),
                    'title' => $b->title,
                ];
            }),
            'bookings' => $bookings->map(function ($b) {
                return [
                    'date' => $b->event_date->format('Y-m-d'),
                    'session' => $b->booking_session,
                    'status' => $b->status,
                ];
            }),
        ]);
    }

    /**
     * Submit Guest Checkout Booking.
     */
    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:50',
            'package_id' => 'required|exists:packages,id',
            'event_date' => 'required|date|after_or_equal:today',
            'booking_session' => 'required|string|in:pagi,siang,sore',
            'event_location' => 'required|string',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'special_notes' => 'nullable|string',
            'bank_destination' => 'required|string',
            'payment_proof_dp' => 'required|file|mimes:jpeg,png,jpg,gif,svg,pdf|max:5120', // Max 5MB
            'payment_proof_admin' => 'required|file|mimes:jpeg,png,jpg,gif,svg,pdf|max:5120', // Max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Cek ketersediaan slot (apakah sudah dibooking/hold)
        $exists = Booking::where('event_date', $request->event_date)
            ->where('booking_session', $request->booking_session)
            ->whereNotIn('status', [Booking::STATUS_CANCELLED])
            ->exists();

        if ($exists) {
            return response()->json([
                'errors' => ['booking_session' => 'Slot waktu yang Anda pilih sudah terisi atau di-hold. Silakan pilih slot lain.']
            ], 422);
        }

        // Cek apakah slot waktu yang dipilih untuk hari ini sudah lewat jamnya
        $now = \Carbon\Carbon::now('Asia/Jakarta');
        $todayStr = $now->format('Y-m-d');
        if ($request->event_date === $todayStr) {
            $currentMinutes = $now->hour * 60 + $now->minute;
            $startMinutes = [
                'pagi' => 9 * 60,   // 09:00
                'siang' => 13 * 60, // 13:00
                'sore' => 17 * 60,  // 17:00
            ];
            
            if (isset($startMinutes[$request->booking_session]) && $currentMinutes >= $startMinutes[$request->booking_session]) {
                return response()->json([
                    'errors' => ['booking_session' => 'Slot waktu yang Anda pilih sudah lewat untuk hari ini. Silakan pilih slot atau tanggal lain.']
                ], 422);
            }
        }


        // Ambil info paket
        $package = Package::findOrFail($request->package_id);
        $totalPrice = (float) $package->base_price;
        $dpAmount = (float) $package->dp_amount;
        $adminFee = 5000.00;

        // Simpan Bukti Transfer
        $dpPath = null;
        $adminPath = null;

        if ($request->hasFile('payment_proof_dp')) {
            $dpPath = $request->file('payment_proof_dp')->store('receipts/dp', 'public');
        }
        if ($request->hasFile('payment_proof_admin')) {
            $adminPath = $request->file('payment_proof_admin')->store('receipts/admin', 'public');
        }

        // Simpan ke database
        $booking = new Booking();
        $booking->booking_code = Booking::generateBookingCode();
        $booking->customer_name = $request->name;
        $booking->customer_email = $request->email ?? 'guest@example.com';
        $booking->customer_phone = $request->whatsapp;
        $booking->package_id = $package->id;
        $booking->event_date = $request->event_date;
        $booking->booking_session = $request->booking_session;
        $booking->event_location = $request->event_location;
        $booking->latitude = $request->latitude;
        $booking->longitude = $request->longitude;
        $booking->special_notes = $request->special_notes;
        $booking->bank_destination = $request->bank_destination;
        $booking->status = Booking::STATUS_AWAITING_VERIFICATION; // Setelah upload, menunggu verifikasi
        $booking->dp_amount = $dpAmount;
        $booking->admin_fee = $adminFee;
        $booking->total_price = $totalPrice;
        $booking->payment_proof_dp_path = $dpPath;
        $booking->payment_proof_admin_path = $adminPath;
        $booking->save();

        try {
            // Dispatch broadcast event
            event(new \App\Events\BookingSubmitted($booking));

            // Send Filament database notification to admin users
            $admins = \App\Models\User::all();
            \Filament\Notifications\Notification::make()
                ->title('Booking Baru Diterima')
                ->body("Booking dari {$booking->customer_name} ({$booking->booking_code}) menunggu verifikasi.")
                ->icon('heroicon-o-clipboard-document-check')
                ->iconColor('success')
                ->actions([
                    \Filament\Notifications\Actions\Action::make('view')
                        ->label('Lihat Detail')
                        ->url(fn () => \App\Filament\Resources\Bookings\BookingResource::getUrl('view', ['record' => $booking->id])),
                ])
                ->sendToDatabase($admins);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Real-time notification/broadcast failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'booking_code' => $booking->booking_code
        ]);
    }

    /**
     * Re-upload payment proof for a booking that was rejected or is awaiting payment.
     */
    public function reuploadPaymentProof(Request $request, $code)
    {
        $booking = Booking::where('booking_code', $code)->first();

        if (!$booking) {
            return response()->json(['message' => 'Kode booking tidak ditemukan.'], 404);
        }

        if ($booking->status !== Booking::STATUS_AWAITING_PAYMENT) {
            return response()->json(['message' => 'Status pemesanan tidak mengizinkan unggah ulang bukti pembayaran.'], 400);
        }

        $validator = Validator::make($request->all(), [
            'payment_proof_dp' => 'required|file|mimes:jpeg,png,jpg,gif,svg,pdf|max:5120', // Max 5MB
            'payment_proof_admin' => 'required|file|mimes:jpeg,png,jpg,gif,svg,pdf|max:5120', // Max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Hapus file bukti transfer lama jika ada untuk menghemat ruang
        if ($booking->payment_proof_dp_path) {
            Storage::disk('public')->delete($booking->payment_proof_dp_path);
        }
        if ($booking->payment_proof_admin_path) {
            Storage::disk('public')->delete($booking->payment_proof_admin_path);
        }

        // Simpan Bukti Transfer Baru
        $dpPath = null;
        $adminPath = null;

        if ($request->hasFile('payment_proof_dp')) {
            $dpPath = $request->file('payment_proof_dp')->store('receipts/dp', 'public');
        }
        if ($request->hasFile('payment_proof_admin')) {
            $adminPath = $request->file('payment_proof_admin')->store('receipts/admin', 'public');
        }

        // Update booking
        $booking->payment_proof_dp_path = $dpPath;
        $booking->payment_proof_admin_path = $adminPath;
        $booking->status = Booking::STATUS_AWAITING_VERIFICATION;
        $booking->save();

        try {
            // Dispatch broadcast event
            event(new \App\Events\BookingSubmitted($booking));

            // Send Filament database notification to admin users
            $admins = \App\Models\User::all();
            \Filament\Notifications\Notification::make()
                ->title('Bukti Pembayaran Diunggah Ulang')
                ->body("Bukti pembayaran baru untuk booking {$booking->customer_name} ({$booking->booking_code}) telah diunggah ulang.")
                ->icon('heroicon-o-arrow-path')
                ->iconColor('info')
                ->actions([
                    \Filament\Notifications\Actions\Action::make('view')
                        ->label('Lihat Detail')
                        ->url(fn () => \App\Filament\Resources\Bookings\BookingResource::getUrl('view', ['record' => $booking->id])),
                ])
                ->sendToDatabase($admins);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Real-time notification/broadcast failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Bukti pembayaran berhasil diunggah ulang dan sedang menunggu verifikasi.',
            'status' => $booking->status
        ]);
    }

    /**
     * Get booking tracking details.
     */
    public function getTrackingDetails($code)
    {
        $booking = Booking::with('package')
            ->where('booking_code', $code)
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'Kode booking tidak ditemukan.'], 404);
        }

        return response()->json([
            'booking_code' => $booking->booking_code,
            'customer_name' => $booking->customer_name,
            'package_name' => $booking->package->name,
            'event_date' => $booking->event_date->format('Y-m-d'),
            'booking_session' => $booking->booking_session,
            'status' => $booking->status,
            'final_drive_link' => $booking->final_drive_link,
            'created_at' => $booking->created_at->toISOString(),
        ]);
    }

}
