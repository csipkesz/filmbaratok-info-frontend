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
          <span class="font-semibold text-paper">{{ searchResults.length }}</span> találat érhető el
        </p>
      </div>
    </div>

    <!-- 1. EMPTY STATE (No results found) -->
    <div
        v-if="searchResults.length === 0"
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

    <!-- 2. GRID RESULTS -->
    <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
    >
      <NuxtLink
          v-for="media in searchResults"
          :key="media.id"
          :to="`/kereses?q=${encodeURIComponent(media.title)}`"
          class="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-ink-soft/80 p-2.5 transition-all duration-300 hover:border-marquee/50 hover:bg-white/5 hover:shadow-xl hover:shadow-black/50"
      >
        <!-- Poster image container -->
        <div class="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-black/40">
          <img
              v-if="media.posterPath"
              :src="`${TMDB_POSTER_BASE}${media.posterPath}`"
              :alt="media.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="h-full w-full flex flex-col items-center justify-center p-2 text-center text-fog/40">
            <UIcon name="i-lucide-film" class="w-8 h-8 mb-1"/>
            <span class="text-[10px] font-body line-clamp-2">{{ media.title }}</span>
          </div>

          <!-- Content category badges overlay -->
          <div
              v-if="getUniqueCategories(media).length > 0"
              class="absolute top-1.5 left-1.5 flex flex-wrap gap-1 z-10"
          >
            <span
                v-for="category in getUniqueCategories(media)"
                :key="category"
                class="rounded bg-black/80 backdrop-blur-md px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider text-marquee border border-white/10 uppercase"
            >
              {{ category }}
            </span>
          </div>
        </div>

        <!-- Media Details -->
        <div class="mt-2.5 flex flex-col justify-between flex-1 space-y-1">
          <div>
            <h3 class="font-display text-sm font-bold text-paper group-hover:text-marquee transition-colors line-clamp-2 leading-snug">
              {{ media.title }}
            </h3>
            <p v-if="media.originalTitle" class="text-[11px] text-fog italic line-clamp-1">
              {{ media.originalTitle }}
            </p>
          </div>

          <!-- Total content appearances -->
          <div v-if="media.contents?.length"
               class="pt-2 text-[10px] font-medium text-fog/70 flex items-center gap-1 border-t border-white/5 mt-1">
            <UIcon name="i-lucide-mic" class="w-3 h-3 text-marquee/80"/>
            <span>{{ media.contents.length }} adásban</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import Fuse from 'fuse.js'
import type {MediaIndexItem} from '~/models/indexes/media-index-item.ts'

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

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

const fuse = computed(() => {
  return new Fuse(props.indexMedias, {
    keys: [
      {name: 'title', weight: 0.5},
      {name: 'originalTitle', weight: 0.3},
      {name: 'contents.title', weight: 0.1},
      {name: 'contents.participants', weight: 0.1}
    ],
    threshold: 0.22, // Adjusts fuzzy match sensitivity (0.0 = exact match, 1.0 = match anything)
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
})

// Execute fuzzy search when search query changes
const searchResults = computed<MediaIndexItem[]>(() => {
  const query = props.searchQuery.trim()
  if (!query) return []

  const results = fuse.value.search(query)
  return results.map(result => result.item)
})

// Helper to extract unique categories from a media's contents
function getUniqueCategories(media: MediaIndexItem): string[] {
  if (!media.contents) return []
  const categories = media.contents.map(c => c.category)
  return Array.from(new Set(categories))
}
</script>