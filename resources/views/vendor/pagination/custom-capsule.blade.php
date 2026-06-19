@if ($paginator->hasPages())
    <nav role="navigation" aria-label="Pagination Navigation" class="custom-pagination-capsule">
        {{-- Left Side: Navigation Links & Page Numbers --}}
        <div class="pagination-left-group">
            {{-- Previous Page Link --}}
            @if ($paginator->onFirstPage())
                <span class="pagination-nav-btn disabled">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                    <span>Previous</span>
                </span>
            @else
                <button type="button" wire:click="previousPage" wire:loading.attr="disabled" class="pagination-nav-btn">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                    <span>Previous</span>
                </button>
            @endif

            {{-- Page Numbers --}}
            <div class="pagination-numbers">
                @foreach ($elements as $element)
                    {{-- "Three Dots" Separator --}}
                    @if (is_string($element))
                        <span class="pagination-dots">{{ $element }}</span>
                    @endif

                    {{-- Array Of Links --}}
                    @if (is_array($element))
                        @foreach ($element as $page => $url)
                            @if ($page == $paginator->currentPage())
                                <div class="pagination-number-btn active">
                                    <span>{{ $page }}</span>
                                </div>
                            @else
                                <button type="button" wire:click="gotoPage({{ $page }})" class="pagination-number-btn">
                                    {{ $page }}
                                </button>
                            @endif
                        @endforeach
                    @endif
                @endforeach
            </div>

            {{-- Next Page Link --}}
            @if ($paginator->hasMorePages())
                <button type="button" wire:click="nextPage" wire:loading.attr="disabled" class="pagination-nav-btn">
                    <span>Next</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                </button>
            @else
                <span class="pagination-nav-btn disabled">
                    <span>Next</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                </span>
            @endif
        </div>

        {{-- Right Side: Results Info --}}
        <div class="pagination-results-info">
            Showing {{ $paginator->firstItem() }} to {{ $paginator->lastItem() }} of {{ $paginator->total() }} results
        </div>
    </nav>
@endif
