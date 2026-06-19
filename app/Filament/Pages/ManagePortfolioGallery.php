<?php

namespace App\Filament\Pages;

use App\Models\Portfolio;
use BackedEnum;
use Filament\Actions\CreateAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class ManagePortfolioGallery extends Page implements HasActions, HasForms
{
    use InteractsWithActions;
    use InteractsWithForms;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCamera;

    protected static ?string $navigationLabel = 'Galeri Portfolio';

    protected static ?string $title = 'Galeri Portfolio';

    protected static string|UnitEnum|null $navigationGroup = 'Konten Landing Page';

    protected static ?int $navigationSort = 2;

    protected string $view = 'filament.pages.manage-portfolio-gallery';

    public function getPortfolios()
    {
        return Portfolio::with('media')->ordered()->get();
    }

    public function createAction(): CreateAction
    {
        return CreateAction::make('create')
            ->label('Tambah Portfolio')
            ->icon('heroicon-o-plus')
            ->size('sm')
            ->model(Portfolio::class)
            ->modalHeading('Tambah Portfolio Baru')
            ->modalWidth('lg')
            ->modalSubmitActionLabel('Tambah')
            ->modalCancelActionLabel('Batal')
            ->createAnother(false)
            ->form([
                TextInput::make('title')
                    ->label('Judul')
                    ->required(),
                Select::make('category')
                    ->label('Kategori')
                    ->options([
                        'wedding' => 'Pernikahan (Wedding)',
                        'graduation' => 'Wisuda (Graduation)',
                        'personal' => 'Sesi Personal',
                        'event' => 'Acara (Event)',
                    ])
                    ->required(),
                SpatieMediaLibraryFileUpload::make('media')
                    ->label('Foto')
                    ->collection('portfolio_gallery')
                    ->image()
                    ->multiple()
                    ->disk('public')
                    ->visibility('public')
                    ->required(),
                Toggle::make('is_featured')
                    ->label('Tampilkan di Landing Page')
                    ->default(true),
            ])
            ->successNotification(
                Notification::make()
                    ->title('Portfolio berhasil ditambahkan')
                    ->success()
            )
            ->slideOver();
    }

    public function editAction(): EditAction
    {
        return EditAction::make('edit')
            ->icon('heroicon-o-pencil-square')
            ->iconButton()
            ->record(fn (array $arguments) => Portfolio::find($arguments['id'] ?? null))
            ->modalHeading(fn (array $arguments) => 'Edit: ' . Portfolio::find($arguments['id'] ?? null)?->title)
            ->modalWidth('lg')
            ->modalSubmitActionLabel('Simpan')
            ->modalCancelActionLabel('Batal')
            ->form([
                TextInput::make('title')
                    ->label('Judul')
                    ->required(),
                Select::make('category')
                    ->label('Kategori')
                    ->options([
                        'wedding' => 'Pernikahan (Wedding)',
                        'graduation' => 'Wisuda (Graduation)',
                        'personal' => 'Sesi Personal',
                        'event' => 'Acara (Event)',
                    ])
                    ->required(),
                SpatieMediaLibraryFileUpload::make('media')
                    ->label('Foto')
                    ->collection('portfolio_gallery')
                    ->image()
                    ->multiple()
                    ->disk('public')
                    ->visibility('public'),
                Toggle::make('is_featured')
                    ->label('Tampilkan di Landing Page'),
            ])
            ->successNotification(
                Notification::make()
                    ->title('Portfolio berhasil diperbarui')
                    ->success()
            )
            ->slideOver();
    }

    public function deleteAction(): DeleteAction
    {
        return DeleteAction::make('delete')
            ->icon('heroicon-o-trash')
            ->iconButton()
            ->color('danger')
            ->record(fn (array $arguments) => Portfolio::find($arguments['id'] ?? null))
            ->modalHeading('Hapus Portfolio')
            ->modalDescription('Apakah Anda yakin ingin menghapus portfolio ini? Tindakan ini tidak dapat dibatalkan.')
            ->modalCancelActionLabel('Batal')
            ->successNotification(
                Notification::make()
                    ->title('Portfolio berhasil dihapus')
                    ->success()
            );
    }
}
