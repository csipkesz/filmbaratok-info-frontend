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
        <NuxtLink
            v-for="media in displayedResults"
            :key="media.id"
            :to="`/kereses?q=${encodeURIComponent(media.title)}`"
            class="group relative flex flex-col overflow-hidden rounded-xl bg-ink-soft/40 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
        >
          <!-- Poster image container -->
          <div class="aspect-[2/3] w-full overflow-hidden bg-ink-soft relative shrink-0">
            <img
                v-if="media.posterPath"
                :src="`${TMDB_POSTER_BASE}${media.posterPath}`"
                :alt="media.title"
                class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
            />
            <div
                v-else
                class="h-full w-full flex flex-col items-center justify-center p-4 text-center bg-white/5 border-b border-white/5"
            >
              <UIcon name="i-lucide-film" class="w-8 h-8 text-fog/40 mb-2 shrink-0"/>
              <span class="font-body text-xs font-semibold text-paper/90 line-clamp-3 leading-snug">
                {{ media.title }}
              </span>
            </div>

            <!-- Gradient overlay -->
            <div
                class="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80 pointer-events-none"/>

            <!-- Category badges overlay -->
            <div
                v-if="getUniqueCategories(media).length > 0"
                class="absolute top-2 left-2 flex flex-wrap gap-1 z-10"
            >
              <span
                  v-for="category in getUniqueCategories(media)"
                  :key="category"
                  class="rounded bg-ink/80 backdrop-blur px-1.5 py-0.5 text-[9px] font-mono text-marquee border border-white/10 uppercase"
              >
                {{ category }}
              </span>
            </div>

            <!-- Total content appearances badge -->
            <span
                v-if="media.contents?.length"
                class="absolute bottom-2 right-2 rounded-md bg-ink/80 backdrop-blur px-2 py-0.5 text-xs font-mono text-fog border border-white/10"
            >
              {{ media.contents.length }} adás
            </span>
          </div>

          <!-- Media Details -->
          <div class="p-3 flex flex-col justify-start min-h-[4.25rem]">
            <h3 class="font-body text-sm font-semibold text-paper line-clamp-1 group-hover:text-marquee transition-colors">
              {{ media.title }}
            </h3>
            <p v-if="media.originalTitle" class="text-xs text-fog italic line-clamp-1 mt-0.5">
              {{ media.originalTitle }}
            </p>
          </div>
        </NuxtLink>
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
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useIntersectionObserver} from '@vueuse/core'
import Fuse from 'fuse.js'
import type {MediaIndexItem} from '~/models/indexes/media-index-item.ts'

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'
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

// Number of items currently rendered in the infinite scroll grid
const visibleCount = ref(PAGE_SIZE)

// Sentinel element ref for IntersectionObserver
const loadMoreTrigger = ref<HTMLElement | null>(null)

// Fuse.js setup
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

// Full set of matching items from Fuse.js
const allSearchResults = computed<MediaIndexItem[]>(() => {
  const query = props.searchQuery.trim()
  if (!query) return []

  const results = fuse.value.search(query)
  return results.map(result => result.item)
})

// Sliced slice of results to render on screen based on visibleCount
const displayedResults = computed(() => {
  return allSearchResults.value.slice(0, visibleCount.value)
})

// Indicates whether there are more items to load
const hasMore = computed(() => {
  return visibleCount.value < allSearchResults.value.length
})

// Function to load the next chunk of 20 items
function loadNextBatch() {
  if (hasMore.value) {
    visibleCount.value += PAGE_SIZE
  }
}

// Reset infinite pagination whenever the search query changes
watch(
    () => props.searchQuery,
    () => {
      visibleCount.value = PAGE_SIZE
    }
)

// Intersection Observer for the bottom trigger element
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

// Helper function to extract unique categories from a media's contents
function getUniqueCategories(media: MediaIndexItem): string[] {
  if (!media.contents) return []
  const categories = media.contents.map(c => c.category)
  return Array.from(new Set(categories))
}
</script>