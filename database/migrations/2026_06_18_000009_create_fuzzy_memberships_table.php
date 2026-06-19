<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fuzzy_memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('variable_id')->constrained('fuzzy_variables')->onDelete('cascade');
            $table->string('label');
            $table->decimal('point_a', 12, 4);
            $table->decimal('point_b', 12, 4);
            $table->decimal('point_c', 12, 4);
            $table->decimal('point_d', 12, 4);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fuzzy_memberships');
    }
};
