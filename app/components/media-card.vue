<template>
  <div
      class="group relative flex flex-col overflow-hidden rounded-xl bg-ink-soft/40 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
      @click="$emit('select', media)"
  >
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

      <div
          class="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80 pointer-events-none"/>

      <div
          v-if="isSpoiler"
          class="absolute top-2 left-2 z-10 rounded bg-rose-950/85 backdrop-blur px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-rose-300 border border-rose-500/30 flex items-center gap-1 shadow-md"
      >
        <UIcon name="i-lucide-alert-triangle" class="w-2.5 h-2.5 text-rose-400"/>
        <span>Spoiler</span>
      </div>

      <div
          v-else-if="uniqueCategories.length > 0"
          class="absolute top-2 left-2 flex flex-wrap gap-1 z-10"
      >
        <span
            v-for="category in uniqueCategories"
            :key="category"
            class="rounded bg-ink/80 backdrop-blur px-1.5 py-0.5 text-[9px] font-mono text-marquee border border-white/10 uppercase"
        >
          {{ formatCategory(category) }}
        </span>
      </div>

      <span
          v-if="media.contents?.length"
          class="absolute bottom-2 right-2 rounded-md bg-ink/80 backdrop-blur px-2 py-0.5 text-xs font-mono text-fog border border-white/10"
      >
        {{ media.contents.length }} adás
      </span>
    </div>

    <div class="p-3 flex flex-col justify-start min-h-[4.25rem]">
      <h3 class="font-body text-sm font-semibold text-paper line-clamp-1 group-hover:text-marquee transition-colors">
        {{ media.title }}
      </h3>
      <p v-if="media.originalTitle" class="text-xs text-fog italic line-clamp-1 mt-0.5">
        {{ media.originalTitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import type {MediaIndexItem} from '~/models/indexes/media-index-item.ts'

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

const props = defineProps({
  media: {
    type: Object as PropType<MediaIndexItem>,
    required: true,
  },
})

defineEmits<{
  (e: 'select', media: MediaIndexItem): void
}>()

const isSpoiler = computed(() => {
  if (!props.media.contents || props.media.contents.length === 0) {
    return false
  }

  return props.media.contents.some(c => c.isSpoiler)
})

const uniqueCategories = computed(() => {
  if (!props.media.contents) {
    return []
  }
  
  const categories = props.media.contents.map(c => c.category)
  return Array.from(new Set(categories))
})

function formatCategory(cat: string): string {
  switch (cat) {
    case 'PODCAST':
      return 'Podcast'
    case 'EXPRESS':
      return 'Express'
    case 'AUDIO_COMMENTARY':
      return 'Audiokommentár'
    case 'ON_SITE':
      return 'Helyszíni'
    case 'GAME':
      return 'Játék'
    default:
      return cat
  }
}
</script>
