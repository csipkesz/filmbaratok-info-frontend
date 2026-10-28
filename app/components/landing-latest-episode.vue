<template>
  <section class="py-8">
    <div class="mb-4 flex flex-wrap items-end justify-between gap-2">
      <h2 class="font-poster text-3xl uppercase sm:text-4xl">Legfrissebb adás</h2>
      <p v-if="latestEpisode" class="text-stone-400">{{ episodeMedias.length }} téma került szóba</p>
    </div>

    <!-- LOADED CONTENT -->
    <div v-if="latestEpisode" class="grid gap-6 lg:grid-cols-[2fr_3fr]">
      <!-- Episode card, stays in place while scrolling through the posters -->
      <BackdropCard
          :image="latestEpisode.thumbnailUrl"
          letterboxed
          class="self-start lg:sticky lg:top-22"
          @click="openYouTube(latestEpisode.youtubeId)"
      >
        <span class="font-poster text-4xl uppercase leading-none">{{ latestEpisode.title }}</span>
        <span v-if="formattedDate" class="mt-1 text-stone-300">{{ formattedDate }}</span>
        <span v-if="latestEpisode.participants?.length" class="mt-2 text-stone-300">{{ latestEpisode.participants.join(', ') }}</span>
        <WatchLabel class="mt-4"/>
      </BackdropCard>

      <!-- Films discussed in the episode -->
      <div class="grid grid-cols-3 content-start gap-3 sm:grid-cols-4">
        <button
            v-for="item in visibleMedias"
            :key="`${item.media.id}-${item.content.timestampInSeconds}`"
            class="group text-left cursor-pointer"
            @click="openYouTube(item.content.youtubeId, item.content.timestampInSeconds)"
        >
          <span class="relative block">
            <img
                v-if="item.media.posterPath"
                :src="`${TMDB_POSTER_BASE}${item.media.posterPath}`"
                :alt="item.media.title"
                class="aspect-[2/3] w-full border-2 border-black object-cover"
                loading="lazy"
            />
            <span v-else class="flex aspect-[2/3] w-full items-end border-2 border-black bg-stone-800 p-2 font-poster text-sm uppercase">
              {{ item.media.title }}
            </span>
            <PosterStickers :media="item.media" size="sm"/>
            <span class="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-xs font-semibold">
              {{ item.media.contents.length }} alkalom
            </span>
          </span>
          <span class="mt-1 line-clamp-1 text-sm font-semibold group-hover:text-primary">{{ item.media.title }}</span>
          <span v-if="item.media.originalTitle" class="line-clamp-1 text-xs italic text-stone-400">{{ item.media.originalTitle }}</span>
        </button>

        <!-- Expands the remaining topics -->
        <button
            v-if="hiddenCount > 0"
            class="flex aspect-[2/3] flex-col items-center justify-center gap-1 border-2 border-dashed border-stone-600 text-stone-300 hover:border-primary hover:text-primary cursor-pointer"
            @click="isExpanded = true"
        >
          <span class="font-poster text-4xl">+{{ hiddenCount }}</span>
          <span class="text-sm">további téma</span>
        </button>
      </div>
    </div>

    <!-- SKELETON LOADING STATE -->
    <div v-else class="grid gap-6 lg:grid-cols-[2fr_3fr]">
      <div class="flex min-h-96 flex-col justify-end gap-2 self-start border-4 border-black p-6">
        <USkeleton class="h-10 w-3/4 rounded-none bg-white/10"/>
        <USkeleton class="h-4 w-1/3 rounded-none bg-white/10"/>
        <USkeleton class="h-4 w-2/3 rounded-none bg-white/10"/>
        <USkeleton class="mt-2 h-9 w-32 rounded-none bg-white/10"/>
      </div>
      <div class="grid grid-cols-3 content-start gap-3 sm:grid-cols-4">
        <div v-for="i in 8" :key="i" class="space-y-1">
          <USkeleton class="aspect-[2/3] w-full rounded-none bg-white/10"/>
          <USkeleton class="h-4 w-5/6 rounded-none bg-white/10"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import type {MediaIndexItem, MediaIndexItemContent} from "~/models/indexes/media-index-item.ts";
import type {ContentIndexItem} from "~/models/indexes/content-index-item.ts";
import {FilmbaratokCategory} from "~/models/enums.ts";
import BackdropCard from "~/components/backdrop-card.vue";
import PosterStickers from "~/components/poster-stickers.vue";
import WatchLabel from "~/components/watch-label.vue";
import {getYouTubeUrl} from "~/utils/get-youtube-url.ts";

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w342'

// Two rows of posters by default, the last slot opens the rest
const POSTER_LIMIT = 8

const props = defineProps({
  indexMedias: {
    type: Array as PropType<MediaIndexItem[]>,
    required: true,
  },
  indexContents: {
    type: Array as PropType<ContentIndexItem[]>,
    required: true,
  },
})

const isExpanded = ref(false)

const latestEpisode = computed<ContentIndexItem | null>(() => {
  const podcasts = props.indexContents
      .filter(c => c.category === FilmbaratokCategory.PODCAST)
      .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
  return podcasts[0] ?? null
})

const episodeMedias = computed<{ media: MediaIndexItem, content: MediaIndexItemContent }[]>(() => {
  if (!latestEpisode.value) {
    return []
  }

  const episodeId = latestEpisode.value.id
  return props.indexMedias
      .flatMap(media => media.contents
          .filter(content => content.id === episodeId)
          .map(content => ({media, content})))
      // Some episodes list the same film twice at the same timestamp in the source data
      .filter((item, index, all) => all.findIndex(other =>
          other.media.id === item.media.id && other.content.timestampInSeconds === item.content.timestampInSeconds) === index)
      .sort((a, b) => (a.content.timestampInSeconds ?? 0) - (b.content.timestampInSeconds ?? 0))
})

const visibleMedias = computed(() => {
  if (isExpanded.value || episodeMedias.value.length <= POSTER_LIMIT) {
    return episodeMedias.value
  }
  return episodeMedias.value.slice(0, POSTER_LIMIT - 1)
})

const hiddenCount = computed(() => episodeMedias.value.length - visibleMedias.value.length)

// Date in Hungarian format (e.g. 2025. március 23.)
const formattedDate = computed(() => {
  if (!latestEpisode.value?.releaseDate) return null;
  return new Date(latestEpisode.value.releaseDate).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
})

function openYouTube(youtubeId: string, timestampInSeconds?: number) {
  window.open(getYouTubeUrl(youtubeId, timestampInSeconds), '_blank', 'noopener,noreferrer')
}
</script>
