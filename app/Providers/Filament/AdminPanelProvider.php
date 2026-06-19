<?php

namespace App\Providers\Filament;

use Andreia\FilamentNordTheme\FilamentNordThemePlugin;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Joaopaulolndev\FilamentEditProfile\FilamentEditProfilePlugin;

class AdminPanelProvider extends PanelProvider
{
  public function panel(Panel $panel): Panel
  {
    return $panel
      ->default()
      ->id('admin')
      ->path('admin')
      ->login()
      ->brandName('Trasa Moment')
      ->brandLogo(fn() => new \Illuminate\Support\HtmlString('
          <div style="display: flex !important; align-items: center !important; gap: 8px !important; height: 32px !important; overflow: hidden !important;">
              <img src="' . asset('favicon.png') . '" alt="Trasa Moment Logo" style="height: 32px !important; width: 32px !important; max-height: 32px !important; max-width: 32px !important; min-width: 32px !important; border-radius: 50% !important; object-fit: cover !important; display: inline-block !important;" />
              <span style="font-size: 1.15rem !important; font-weight: 700 !important; letter-spacing: -0.025em !important; line-height: 1 !important; white-space: nowrap !important;">Trasa Moment</span>
          </div>
      '))
      ->brandLogoHeight('2.5rem')
      ->globalSearch(false)
      ->favicon(asset('favicon.png'))
      ->colors([
        'primary' => Color::Amber,
      ])
      ->plugin(FilamentNordThemePlugin::make())
      ->plugin(
        \Joaopaulolndev\FilamentEditProfile\FilamentEditProfilePlugin::make()
          ->shouldRegisterNavigation(false)
          ->shouldShowAvatarForm(
            directory: 'avatars',
            rules: 'mimes:jpeg,png,jpg,gif|max:2048'
          )
      )
      ->userMenuItems([
        'profile' => \Filament\Navigation\MenuItem::make()
          ->label('Edit Profil')
          ->url(fn(): string => \Joaopaulolndev\FilamentEditProfile\Pages\EditProfilePage::getUrl())
          ->icon('heroicon-m-user-circle'),
      ])
      ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
      ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
      ->pages([
        Dashboard::class,
      ])
      ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
      ->widgets([
        // AccountWidget::class,
        // FilamentInfoWidget::class,
      ])
      ->middleware([
        EncryptCookies::class,
        AddQueuedCookiesToResponse::class,
        StartSession::class,
        AuthenticateSession::class,
        ShareErrorsFromSession::class,
        PreventRequestForgery::class,
        SubstituteBindings::class,
        DisableBladeIconComponents::class,
        DispatchServingFilamentEvent::class,
      ])
      ->authMiddleware([
        Authenticate::class,
      ]);
  }
}
