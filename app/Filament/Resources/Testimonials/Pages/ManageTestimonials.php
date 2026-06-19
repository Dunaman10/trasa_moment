<?php

namespace App\Filament\Resources\Testimonials\Pages;

use App\Filament\Resources\Testimonials\TestimonialResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageTestimonials extends ManageRecords
{
    protected static string $resource = TestimonialResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('Tambah Testimoni')
                ->modalHeading('Tambah Testimoni Baru')
                ->modalSubmitActionLabel('Tambah')
                ->modalCancelActionLabel('Batal')
                ->createAnother(false),
        ];
    }
}
