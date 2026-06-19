<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->foreignId('package_id')->constrained('packages')->onDelete('restrict');
            
            // Halaman Jadwal
            $table->date('event_date');
            $table->string('booking_session');
            
            // Formulir Checkout
            $table->text('event_location');
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->text('special_notes')->nullable();
            $table->string('bank_destination');
            
            $table->string('status')->default('awaiting_payment');
            
            // Struktur Harga
            $table->decimal('dp_amount', 12, 2);
            $table->decimal('admin_fee', 8, 2)->default(5000);
            $table->decimal('total_price', 12, 2);
            
            // Bukti Transfer
            $table->string('payment_proof_dp_path')->nullable();
            $table->string('payment_proof_admin_path')->nullable();
            
            $table->string('final_drive_link')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
