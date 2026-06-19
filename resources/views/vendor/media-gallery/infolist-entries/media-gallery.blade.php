<x-dynamic-component :component="$getEntryWrapperView()" :entry="$entry">
    <x-media-gallery-viewer
        :media="$entry->getMediaItems()"
        :size="$entry->getSize()"
        :rounded="$entry->getRounded()"
    />
</x-dynamic-component>
