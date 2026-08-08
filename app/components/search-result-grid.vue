<template>
  <div class="space-y-6 py-4">
    <!-- Search Results Header -->
    <div class="flex items-center justify-between border-b border-white/10 pb-4">
      <div>
        <h2 class="font-display text-xl sm:text-2xl font-bold text-paper flex items-center gap-2">
          <span>Keresési találatok</span>
          <span class="text-sm font-mono font-normal text-fog/70">
            ("{{ searchQuery }}")
          </span>
        </h2>
        <p class="text-xs text-fog/70 mt-1">
          Összesen
          <span class="font-semibold text-paper">{{ allSearchResults.length }}</span>
          találat
        </p>
      </div>

      <button
          @click="$emit('clear')"
          class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-fog hover:text-paper hover:bg-white/10 transition-colors"
      >
        <UIcon name="i-lucide-x" class="w-3.5 h-3.5"/>
        <span>Keresés törlése</span>
      </button>
    </div>

    <!-- 1. EMPTY STATE (No results found) -->
    <div
        v-if="allSearchResults.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-ink-soft/40 border border-white/5"
    >
      <div
          class="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-fog/40 mb-3">
        <UIcon name="i-lucide-search-x" class="w-6 h-6"/>
      </div>
      <h3 class="font-display text-lg font-semibold text-paper">Sajnos nincs találat</h3>
      <p class="text-xs text-fog max-w-sm mt-1 mb-4">
        Próbálj meg más kulcsszóra keresni, vagy ellenőrizd az eredeti (angol) címet.
      </p>
      <button
          @click="$emit('clear')"
          class="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-xs font-semibold text-paper transition-all"
      >
        <span>Mutasd az összes tartalmat</span>
      </button>
    </div>

    <!-- 2. GRID RESULTS (Matching reference card styling) -->
    <div v-else class="space-y-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
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
        <div v-if="hasMore" class="flex items-center gap-2 text-xs font-mono text-fog/70">
          <UIcon name="i-lucide-loader-2" class="w-4 h-4 animate-spin text-marquee"/>
          <span>További találatok betöltése...</span>
        </div>
        <p v-else-if="allSearchResults.length > PAGE_SIZE" class="text-xs font-mono text-fog/50">
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

const PAGE_SIZE = 20

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
      let url = 'https://www.youtube.com/watch?v=' + content.youtubeId
      if (content.timestampInSeconds) {
        url += `&t=${content.timestampInSeconds}s`
      }

      window.open(url, '_blank', 'noopener,noreferrer')
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