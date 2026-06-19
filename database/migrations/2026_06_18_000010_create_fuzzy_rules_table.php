<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fuzzy_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_membership_id')->constrained('fuzzy_memberships')->onDelete('cascade');
            $table->foreignId('scale_membership_id')->constrained('fuzzy_memberships')->onDelete('cascade');
            $table->foreignId('duration_membership_id')->constrained('fuzzy_memberships')->onDelete('cascade');
            $table->foreignId('recommended_package_id')->constrained('packages')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fuzzy_rules');
    }
};
