<template>
  <div class="mx-auto max-w-6xl space-y-8 px-4 pt-12 pb-16 sm:px-6">

    <div class="space-y-2">
      <h1 class="font-poster text-5xl uppercase leading-none sm:text-6xl">
        Kibeszélt filmek és sorozatok
      </h1>
      <p class="max-w-2xl text-lg text-stone-300">
        Böngészd az összes eddig elhangzott filmet, sorozatot a Filmbarátok adásaiból.
      </p>
    </div>

    <div class="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <!-- SIDEBAR: categories as video store shelf signs -->
      <aside class="space-y-6 self-start lg:sticky lg:top-22">
        <UInput
            v-model="searchQuery"
            placeholder="Gyorskeresés a listában..."
            icon="i-lucide-search"
            class="w-full"
            :ui="{ base: 'bg-black/50' }"
        />

        <div>
          <p class="mb-2 font-poster uppercase tracking-wider text-primary">Polcok</p>
          <button
              v-for="cat in categoryFilters"
              :key="cat.value"
              class="flex w-full items-baseline justify-between border-b-4 border-shelf py-2 text-left font-poster text-2xl uppercase transition-colors hover:text-primary"
              :class="selectedCategory === cat.value ? 'text-primary' : 'text-stone-300'"
              @click="selectedCategory = cat.value"
          >
            <span>{{ cat.label }}</span>
            <span v-if="!isLoading" class="font-text text-sm text-stone-500">{{ categoryCounts[cat.value] }}</span>
          </button>
        </div>

        <div>
          <p class="mb-2 font-poster uppercase tracking-wider text-primary">Rendezés</p>
          <URadioGroup v-model="sortBy" :items="sortOptions"/>
        </div>
      </aside>

      <div>
        <div v-if="filteredMedias.length > 0" class="space-y-8">
          <p class="text-stone-400">
            <span class="font-semibold text-stone-100">{{ filteredMedias.length }}</span> film és sorozat ezen a polcon
          </p>

          <div class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
            <MediaCard
                v-for="media in displayedMedias"
                :key="media.id"
                :media="media"
                @select="handleMediaSelect"
            />
          </div>

          <!-- INFINITE SCROLL SENTINEL -->
          <div ref="loadMoreTrigger" class="flex items-center justify-center py-6">
            <div v-if="hasMore" class="flex items-center gap-2 text-sm text-stone-400">
              <UIcon name="i-lucide-loader-2" class="size-4 animate-spin text-primary"/>
              <span>További filmek betöltése...</span>
            </div>
            <p v-else-if="filteredMedias.length > PAGE_SIZE" class="text-sm text-stone-500">
              Minden filmet megjelenítettünk ({{ filteredMedias.length }} elem).
            </p>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div
            v-else-if="!isLoading"
            class="flex flex-col items-center justify-center border-4 border-dashed border-stone-700 py-20 text-center"
        >
          <UIcon name="i-lucide-film" class="mb-3 size-10 text-stone-500"/>
          <h3 class="font-poster text-2xl uppercase">Nincs a szűrésnek megfelelő tartalom</h3>
          <p class="mt-1 mb-4 max-w-sm text-stone-400">
            Próbálj meg más polcot választani vagy töröld a keresési feltételt.
          </p>
          <UButton label="Szűrők alaphelyzetbe állítása" @click="resetFilters"/>
        </div>

        <!-- SKELETON LOADING STATE -->
        <div v-else class="space-y-8">
          <USkeleton class="h-6 w-56 rounded-none bg-white/10"/>
          <div class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
            <div v-for="i in 12" :key="i" class="flex flex-col">
              <USkeleton class="aspect-[2/3] w-full rounded-none bg-white/10"/>
              <div class="space-y-2 pt-3">
                <USkeleton class="h-4 w-5/6 rounded-none bg-white/10"/>
                <USkeleton class="h-3 w-1/2 rounded-none bg-white/10"/>
              </div>
            </div>
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
import {FilmbaratokCategory} from "~/models/enums.ts";

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
const jsonRepo = useJsonRepo()

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
  {label: 'Podcast', value: FilmbaratokCategory.PODCAST},
  {label: 'Expressz', value: FilmbaratokCategory.EXPRESS},
  {label: 'Audiokommentár', value: FilmbaratokCategory.AUDIO_COMMENTARY},
  // { label: 'Helyszíni', value: 'ON_SITE' },
  // { label: 'Játék', value: 'GAME' },
]

const sortOptions = [
  {label: 'Cím szerint (A-Z)', value: 'title-asc'},
  {label: 'Cím szerint (Z-A)', value: 'title-desc'},
  {label: 'Legtöbb alkalom', value: 'contents-desc'},
  {label: 'Legkevesebb alkalom', value: 'contents-asc'},
]

// Number of titles on each shelf, shown next to the category name
const categoryCounts = computed<Record<string, number>>(() => Object.fromEntries(categoryFilters.map(cat => [
  cat.value,
  cat.value === 'ALL'
      ? allMedias.value.length
      : allMedias.value.filter(m => m.contents?.some(c => c.category === cat.value)).length,
])))

onMounted(async () => {
  allMedias.value = await jsonRepo.fetchIndex('medias');
  isLoading.value = false
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
