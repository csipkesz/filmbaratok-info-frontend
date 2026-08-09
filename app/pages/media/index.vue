<template>
  <div class="bg-ink min-h-screen text-paper py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

      <div class="space-y-3">
        <h1 class="font-display text-3xl sm:text-5xl font-bold tracking-tight text-paper">
          Kibeszélt filmek és sorozatok
        </h1>
        <p class="font-body text-base text-fog max-w-2xl">
          Böngészd az összes eddig elhangzott filmet, sorozatot a Filmbarátok adásaiból.
        </p>
      </div>

      <div
          class="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-ink-soft/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <div class="w-full md:w-80">
          <UInput
              v-model="searchQuery"
              size="md"
              placeholder="Gyorskeresés a listában..."
              icon="i-lucide-search"
              class="w-full [&_input]:rounded-xl [&_input]:bg-ink/80 [&_input]:border-white/10 [&_input]:text-paper [&_input]:placeholder-fog/60"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
              v-for="cat in categoryFilters"
              :key="cat.value"
              @click="selectedCategory = cat.value"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer"
              :class="selectedCategory === cat.value
                ? 'bg-marquee text-ink shadow-md font-bold'
                : 'bg-white/5 text-fog hover:text-paper hover:bg-white/10 border border-white/5'"
          >
            {{ cat.label }}
          </button>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs text-fog font-medium">Rendezés:</span>
          <select
              v-model="sortBy"
              class="bg-ink/80 border border-white/10 text-paper text-xs rounded-xl px-3 py-2 outline-none focus:border-marquee transition-colors cursor-pointer"
          >
            <option value="title-asc">Cím szerint (A-Z)</option>
            <option value="title-desc">Cím szerint (Z-A)</option>
            <option value="contents-desc">Legtöbb alkalom</option>
            <option value="contents-asc">Legkevesebb alkalom</option>
          </select>
        </div>
      </div>

      <div v-if="filteredMedias.length > 0" class="space-y-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          <MediaCard
              v-for="media in displayedMedias"
              :key="media.id"
              :media="media"
              @select="handleMediaSelect"
          />
        </div>

        <!-- INFINITE SCROLL SENTINEL -->
        <div ref="loadMoreTrigger" class="flex items-center justify-center py-6">
          <div v-if="hasMore" class="flex items-center gap-2 text-xs font-mono text-fog/70">
            <UIcon name="i-lucide-loader-2" class="w-4 h-4 animate-spin text-marquee"/>
            <span>További filmek betöltése...</span>
          </div>
          <p v-else-if="filteredMedias.length > PAGE_SIZE" class="text-xs font-mono text-fog/50">
            Minden filmet megjelenítettünk ({{ filteredMedias.length }} elem).
          </p>
        </div>
      </div>

      <div
          v-else-if="!isLoading"
          class="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-ink-soft/40 border border-white/5"
      >
        <UIcon name="i-lucide-film" class="w-12 h-12 text-fog/30 mb-3"/>
        <h3 class="font-display text-xl font-semibold text-paper">Nincs a szűrésnek megfelelő tartalom</h3>
        <p class="text-xs text-fog max-w-sm mt-1 mb-4">
          Próbálj meg más kategóriát választani vagy töröld a keresési feltételt.
        </p>
        <button
            @click="resetFilters"
            class="px-4 py-2 rounded-xl bg-white/10 text-paper text-xs font-semibold hover:bg-white/20 transition-colors"
        >
          Szűrők alaphelyzetbe állítása
        </button>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <div v-for="i in 12" :key="i"
             class="flex flex-col overflow-hidden rounded-xl bg-ink-soft/40 border border-white/5">
          <USkeleton class="aspect-[2/3] w-full rounded-none bg-white/10"/>
          <div class="p-3 space-y-2">
            <USkeleton class="h-4 w-5/6 rounded bg-white/10"/>
            <USkeleton class="h-3 w-1/2 rounded bg-white/10"/>
          </div>
        </div>
      </div>
    </div>

    <MediaContentModal v-model="isModalOpen" :media="selectedMedia"/>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import {useIntersectionObserver} from '@vueuse/core'
import type {MediaIndexItem} from "~/models/indexes/media-index-item.ts";
import Fuse from "fuse.js";
import {getYouTubeUrl} from "~/utils/get-youtube-url.ts";

useHead({
  title: 'Filmbarátok info - Kibeszélt tartalmak',
  meta: [
    {
      name: 'description',
      content: 'A Filmbarátok podcast adásaiban kibeszélt összes film és sorozat böngészhető listája.'
    }
  ]
})

const PAGE_SIZE = 24

const allMedias = ref<MediaIndexItem[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('ALL')
const sortBy = ref<'title-asc' | 'title-desc' | 'contents-desc' | 'contents-asc'>('title-asc')

const visibleCount = ref(PAGE_SIZE)
const loadMoreTrigger = ref<HTMLElement | null>(null)
const selectedMedia = ref<MediaIndexItem | null>(null)
const isModalOpen = ref(false)

const categoryFilters = [
  {label: 'Összes', value: 'ALL'},
  {label: 'Podcast', value: 'PODCAST'},
  {label: 'Expressz', value: 'EXPRESS'},
  {label: 'Audiokommentár', value: 'AUDIO_COMMENTARY'},
  // { label: 'Helyszíni', value: 'ON_SITE' },
  // { label: 'Játék', value: 'GAME' },
]

onMounted(async () => {
  try {
    const data = await $fetch<MediaIndexItem[]>('/data/index/medias.json')
    allMedias.value = data || []
  } catch (e) {
    console.error('Error on load medias index:', e)
  } finally {
    isLoading.value = false
  }
})

// TODO: Merge search result grid and this functionality
const fuse = computed(() => {
  return new Fuse(allMedias.value, {
    keys: [
      {name: 'title', weight: 0.5},
      {name: 'originalTitle', weight: 0.3},
      {name: 'contents.title', weight: 0.1},
      {name: 'contents.participants', weight: 0.1},
    ],
    threshold: 0.22,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
})

const filteredMedias = computed(() => {
  let result = [...allMedias.value]

  if (searchQuery.value.trim()) {
    const searchResults = fuse.value.search(searchQuery.value)
    result = searchResults.map(r => r.item)
  }

  if (selectedCategory.value !== 'ALL') {
    result = result.filter(m =>
        m.contents?.some(c => c.category === selectedCategory.value)
    )
  }

  result.sort((a, b) => {
    if (sortBy.value === 'title-asc') {
      return a.title.localeCompare(b.title, 'hu')
    } else if (sortBy.value === 'title-desc') {
      return b.title.localeCompare(a.title, 'hu')
    } else if (sortBy.value === 'contents-desc') {
      return (b.contents?.length || 0) - (a.contents?.length || 0)
    } else if (sortBy.value === 'contents-asc') {
      return (a.contents?.length || 0) - (b.contents?.length || 0)
    }
    return 0
  })

  return result
})

const displayedMedias = computed(() => {
  return filteredMedias.value.slice(0, visibleCount.value)
})

const hasMore = computed(() => {
  return visibleCount.value < filteredMedias.value.length
})

function loadNextBatch() {
  if (hasMore.value) {
    visibleCount.value += PAGE_SIZE
  }
}

function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'ALL'
  sortBy.value = 'title-asc'
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

watch([searchQuery, selectedCategory, sortBy], () => {
  visibleCount.value = PAGE_SIZE
})

useIntersectionObserver(
    loadMoreTrigger,
    ([{isIntersecting}]) => {
      if (isIntersecting && hasMore.value) {
        loadNextBatch()
      }
    },
    {rootMargin: '200px'}
)
</script>
