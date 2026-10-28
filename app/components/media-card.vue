<template>
  <div
      class="group relative flex cursor-pointer select-none flex-col"
      @click="$emit('select', media)"
  >
    <div class="relative aspect-[2/3] w-full shrink-0 border-4 border-black bg-stone-800 transition-transform duration-200 group-hover:-translate-y-1">
      <img
          v-if="media.posterPath"
          :src="`${TMDB_POSTER_BASE}${media.posterPath}`"
          :alt="media.title"
          class="h-full w-full object-cover"
          loading="lazy"
      />
      <div
          v-else
          class="flex h-full w-full flex-col items-center justify-center p-4 text-center"
      >
        <UIcon name="i-lucide-film" class="mb-2 size-8 shrink-0 text-stone-500"/>
        <span class="line-clamp-3 font-poster uppercase leading-snug">
          {{ media.title }}
        </span>
      </div>

      <PosterStickers :media="media"/>

      <span
          v-if="media.contents?.length"
          class="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-xs font-semibold"
      >
        {{ media.contents.length }} alkalom
      </span>
    </div>

    <div class="flex min-h-[4.25rem] flex-col justify-start pt-3">
      <h3 class="line-clamp-1 font-semibold transition-colors group-hover:text-primary">
        {{ media.title }}
      </h3>
      <p v-if="media.originalTitle" class="line-clamp-1 text-sm italic text-stone-400">
        {{ media.originalTitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {MediaIndexItem} from '~/models/indexes/media-index-item.ts'
import PosterStickers from "~/components/poster-stickers.vue";

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

defineProps({
  media: {
    type: Object as PropType<MediaIndexItem>,
    required: true,
  },
})

defineEmits<{
  (e: 'select', media: MediaIndexItem): void
}>()
</script>
