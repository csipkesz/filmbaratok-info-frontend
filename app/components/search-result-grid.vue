<template>
  <div class="space-y-6 py-4">
    <!-- Search results header -->
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="font-poster text-3xl uppercase">Találatok</h2>
        <p class="text-stone-400">
          <span class="font-semibold text-stone-100">{{ allSearchResults.length }}</span>
          találat erre: „{{ searchQuery }}”
        </p>
      </div>

      <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-x"
          label="Keresés törlése"
          @click="$emit('clear')"
      />
    </div>

    <!-- 1. EMPTY STATE (no results) -->
    <div
        v-if="allSearchResults.length === 0"
        class="flex flex-col items-center justify-center border-4 border-dashed border-stone-700 py-16 text-center"
    >
      <UIcon name="i-lucide-search-x" class="mb-3 size-10 text-stone-500"/>
      <h3 class="font-poster text-2xl uppercase">Sajnos nincs találat</h3>
      <p class="mt-1 mb-4 max-w-sm text-stone-400">
        Próbálj meg más kulcsszóra keresni, vagy ellenőrizd az eredeti (angol) címet.
      </p>
      <UButton label="Mutasd az összes tartalmat" @click="$emit('clear')"/>
    </div>

    <!-- 2. RESULT GRID -->
    <div v-else class="space-y-8">
      <div class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-6">
        <MediaCard
            v-for="media in displayedResults"
            :key="media.id"
            :media="media"
            @select="handleMediaSelect"
        />
      </div>

      <!-- INFINITE SCROLL SENTINEL / LOADING INDICATOR -->
      <div
          ref="loadMoreTrigger"
          class="flex items-center justify-center py-6"
      >
        <div v-if="hasMore" class="flex items-center gap-2 text-sm text-stone-400">
          <UIcon name="i-lucide-loader-2" class="size-4 animate-spin text-primary"/>
          <span>További találatok betöltése...</span>
        </div>
        <p v-else-if="allSearchResults.length > PAGE_SIZE" class="text-sm text-stone-500">
          Minden találatot megjelenítettünk.
        </p>
      </div>
    </div>

    <MediaContentModal v-model="isModalOpen" :media="selectedMedia"/>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useIntersectionObserver} from '@vueuse/core'
import Fuse from 'fuse.js'
import type {MediaIndexItem} from '~/models/indexes/media-index-item.ts'
import MediaCard from '~/components/media-card.vue'
import MediaContentModal from '~/components/media-content-modal.vue'
import {getYouTubeUrl} from "~/utils/get-youtube-url.ts";

const PAGE_SIZE = 24

const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
  indexMedias: {
    type: Array as PropType<MediaIndexItem[]>,
    required: true,
  },
})

defineEmits(['clear'])

const visibleCount = ref(PAGE_SIZE)
const loadMoreTrigger = ref<HTMLElement | null>(null)
const selectedMedia = ref<MediaIndexItem | null>(null)
const isModalOpen = ref(false)

const fuse = computed(() => {
  return new Fuse(props.indexMedias, {
    keys: [
      {name: 'title', weight: 0.5},
      {name: 'originalTitle', weight: 0.3},
      {name: 'contents.title', weight: 0.1},
      {name: 'contents.participants', weight: 0.1}
    ],
    threshold: 0.22,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
})

const allSearchResults = computed<MediaIndexItem[]>(() => {
  const query = props.searchQuery.trim()
  if (!query) return []

  const results = fuse.value.search(query)
  return results.map(result => result.item)
})

const displayedResults = computed(() => {
  return allSearchResults.value.slice(0, visibleCount.value)
})

const hasMore = computed(() => {
  return visibleCount.value < allSearchResults.value.length
})

function loadNextBatch() {
  if (hasMore.value) {
    visibleCount.value += PAGE_SIZE
  }
}

function handleMediaSelect(media: MediaIndexItem) {
  if (!media.contents || media.contents.length === 0) return

  if (media.contents.length === 1) {
    const content = media.contents[0]
    if (content?.youtubeId) {
      window.open(getYouTubeUrl(content.youtubeId, content.timestampInSeconds), '_blank', 'noopener,noreferrer')
    }
  } else {
    selectedMedia.value = media
    isModalOpen.value = true
  }
}

watch(
    () => props.searchQuery,
    () => {
      visibleCount.value = PAGE_SIZE
    }
)

useIntersectionObserver(
    loadMoreTrigger,
    ([{isIntersecting}]) => {
      if (isIntersecting && hasMore.value) {
        loadNextBatch()
      }
    },
    {
      rootMargin: '200px',
    }
)
</script>
