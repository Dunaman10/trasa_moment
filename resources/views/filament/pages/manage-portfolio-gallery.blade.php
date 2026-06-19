<x-filament-panels::page>
    <style>
        .portfolio-gallery-container {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        .portfolio-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-radius: 12px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
            gap: 12px;
        }
        .dark .portfolio-header {
            background: #111827;
            border-color: #1f2937;
        }
        @media (max-width: 640px) {
            .portfolio-header {
                flex-direction: column;
                align-items: stretch;
                text-align: center;
                gap: 12px;
                padding: 14px 16px;
            }
            .portfolio-header > div {
                display: flex;
                justify-content: center;
                width: 100%;
            }
        }
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
        }
        .portfolio-card {
            display: flex;
            flex-direction: column;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }
        .dark .portfolio-card {
            background: #111827;
            border-color: #1f2937;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .portfolio-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .portfolio-media-area {
            padding: 16px;
            background: #f9fafb;
            border-bottom: 1px solid #f3f4f6;
            min-height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .dark .portfolio-media-area {
            background: #0b0f19;
            border-color: #1f2937;
        }
        .portfolio-featured-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            background: #fef3c7;
            color: #d97706;
            border: 1px solid #fde68a;
            box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
            z-index: 10;
        }
        .dark .portfolio-featured-badge {
            background: rgba(245, 158, 11, 0.15);
            color: #fbbf24;
            border-color: rgba(245, 158, 11, 0.2);
        }
        .portfolio-badge-icon {
            width: 14px !important;
            height: 14px !important;
            fill: currentColor;
            flex-shrink: 0;
        }
        .portfolio-badge-icon svg {
            width: 14px !important;
            height: 14px !important;
        }
        .portfolio-details {
            padding: 20px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            gap: 12px;
        }
        .portfolio-category {
            align-self: flex-start;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            background: #f3f4f6;
            color: #4b5563;
            border: 1px solid #e5e7eb;
        }
        .dark .portfolio-category {
            background: #1f2937;
            color: #d1d5db;
            border-color: #374151;
        }
        .portfolio-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: #111827;
            margin: 0;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .dark .portfolio-title {
            color: #ffffff;
        }
        .portfolio-footer {
            margin-top: auto;
            padding-top: 16px;
            border-top: 1px solid #f3f4f6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .dark .portfolio-footer {
            border-color: #1f2937;
        }
        .portfolio-order {
            font-size: 0.75rem;
            color: #9ca3af;
        }
        .portfolio-order-val {
            font-weight: 500;
            color: #4b5563;
        }
        .dark .portfolio-order-val {
            color: #9ca3af;
        }
        .portfolio-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    </style>

    <div 
        class="portfolio-gallery-container"
        x-data="{
            lightboxOpen: false,
            lightboxSrc: '',
            lightboxImages: [],
            lightboxThumbs: [],
            lightboxIndex: 0,
            openLightbox(images, thumbs, index) {
                this.lightboxImages = images;
                this.lightboxThumbs = thumbs;
                this.lightboxIndex  = index;
                this.lightboxSrc    = images[index];
                this.lightboxOpen   = true;
                this.$nextTick(() => this.scrollThumb(index));
            },
            closeLightbox() {
                this.lightboxOpen = false;
            },
            goTo(index) {
                this.lightboxIndex = index;
                this.lightboxSrc   = this.lightboxImages[index];
                this.scrollThumb(index);
            },
            nextImage() {
                this.goTo((this.lightboxIndex + 1) % this.lightboxImages.length);
            },
            prevImage() {
                this.goTo((this.lightboxIndex - 1 + this.lightboxImages.length) % this.lightboxImages.length);
            },
            scrollThumb(index) {
                const strip = this.$refs.thumbStrip;
                if (!strip) return;
                const thumb = strip.children[index];
                if (thumb) thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }"
        @keydown.escape.window="closeLightbox()"
        @keydown.arrow-right.window="if (lightboxOpen) nextImage()"
        @keydown.arrow-left.window="if (lightboxOpen) prevImage()"
    >
        {{-- Header bar --}}
        <div class="portfolio-header">
            <div>
                <p class="text-sm text-gray-500 dark:text-gray-400" style="margin: 0;">
                    Total: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ $this->getPortfolios()->count() }}</span> portfolio item(s)
                </p>
            </div>
            <div>
                {{ $this->createAction }}
            </div>
        </div>

        {{-- Grid Container --}}
        @if($this->getPortfolios()->isEmpty())
            <div class="flex flex-col items-center justify-center p-12 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50">
                <x-heroicon-o-camera class="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" style="width: 48px; height: 48px;" />
                <p class="text-base font-medium text-gray-500 dark:text-gray-400">Belum ada portfolio</p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Mulai dengan menambahkan portfolio pertama Anda</p>
            </div>
        @else
            <div class="portfolio-grid">
                @foreach($this->getPortfolios() as $portfolio)
                    @php
                        $media = $portfolio->getMedia('portfolio_gallery');
                        $imageUrls = [];
                        $thumbUrls = [];
                        
                        if ($media->isNotEmpty()) {
                            foreach ($media as $item) {
                                if (str_starts_with($item->mime_type, 'image/')) {
                                    $imageUrls[] = $item->getUrl();
                                    $thumbUrls[] = $item->hasGeneratedConversion('thumbnail') 
                                        ? $item->getUrl('thumbnail') 
                                        : ($item->hasGeneratedConversion('preview') ? $item->getUrl('preview') : $item->getUrl());
                                }
                            }
                        }
                        
                        // Fallback cover image
                        $coverUrl = !empty($imageUrls) ? $imageUrls[0] : $portfolio->getRawOriginal('image_path');
                        
                        // If no Spatie media but we have fallback image_path, make it zoomable too
                        if (empty($imageUrls) && $coverUrl) {
                            $imageUrls[] = $coverUrl;
                            $thumbUrls[] = $coverUrl;
                        }

                        // Map category to readable label
                        $categoryLabels = [
                            'wedding' => 'Pernikahan (Wedding)',
                            'graduation' => 'Wisuda (Graduation)',
                            'personal' => 'Sesi Personal',
                            'event' => 'Acara (Event)',
                        ];
                        $displayCategory = $categoryLabels[$portfolio->category] ?? $portfolio->category;
                    @endphp
                    
                    <div class="portfolio-card">
                        {{-- Image / Gallery Section --}}
                        <div class="portfolio-media-area">
                            @if($coverUrl)
                                <div 
                                    style="width: 100%; aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; background: #e5e7eb; cursor: pointer;"
                                    @click="openLightbox({{ json_encode($imageUrls) }}, {{ json_encode($thumbUrls) }}, 0)"
                                >
                                    <img
                                        src="{{ $coverUrl }}"
                                        alt="{{ $portfolio->title }}"
                                        style="width: 100%; height: 100%; object-fit: cover;"
                                    >
                                </div>
                            @else
                                <div style="width: 100%; aspect-ratio: 16/9; border-radius: 8px; background: #e5e7eb; display: flex; align-items: center; justify-content: center;">
                                    <x-heroicon-o-photo style="width: 40px; height: 40px; color: #9ca3af;" />
                                </div>
                            @endif

                            {{-- Featured Star Badge --}}
                            @if($portfolio->is_featured)
                                <div class="portfolio-featured-badge">
                                    <x-heroicon-s-star class="portfolio-badge-icon" />
                                    <span>Featured</span>
                                </div>
                            @endif
                        </div>

                        {{-- Metadata & Actions --}}
                        <div class="portfolio-details">
                            <span class="portfolio-category">
                                {{ $displayCategory }}
                            </span>
                            <h3 class="portfolio-title">
                                {{ $portfolio->title }}
                            </h3>

                            <div class="portfolio-footer" style="justify-content: flex-end;">
                                <div class="portfolio-actions">
                                    {{ ($this->editAction)(['id' => $portfolio->id]) }}
                                    {{ ($this->deleteAction)(['id' => $portfolio->id]) }}
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>

    @include('media-gallery::components.media-lightbox')
</x-filament-panels::page>
