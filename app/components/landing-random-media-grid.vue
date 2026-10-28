<template>
  <section class="py-8">
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="font-poster text-3xl uppercase sm:text-4xl">
          Erről is beszéltek a srácok
        </h2>
        <p class="text-stone-400">
          Néhány érdekesség a több száz átbeszélt film és sorozat közül
        </p>
      </div>

      <UButton to="/media" variant="link" trailing-icon="i-lucide-arrow-right" label="Összes film"/>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      <template v-if="medias.length > 0">
        <button
            v-for="(media, index) in medias"
            :key="media.id"
            class="group flex-col text-left cursor-pointer"
            :class="shelfVisibility(index)"
            @click="handleMediaSelect(media)"
        >
          <div class="relative mx-2 mt-4 transform-gpu transition-transform duration-200 group-hover:-translate-y-2">
            <img
                :src="`${TMDB_POSTER_BASE}${media.posterPath}`"
                :alt="media.title"
                class="aspect-[2/3] w-full border-4 border-black object-cover shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                loading="lazy"
            />
            <PosterStickers :media="media"/>
            <span class="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 text-xs font-semibold">
              {{ media.contents.length }} alkalom
            </span>
          </div>
          <!-- The shelf board -->
          <div class="h-3 border-b-4 border-black/40 bg-shelf"/>
          <p class="px-2 pt-3 pb-2">
            <span class="line-clamp-2 font-semibold leading-tight group-hover:text-primary">{{ media.title }}</span>
            <span v-if="media.originalTitle" class="line-clamp-1 text-sm italic text-stone-400">{{ media.originalTitle }}</span>
          </p>
        </button>
      </template>

      <!-- SKELETON LOADING STATE -->
      <template v-else>
        <div
            v-for="i in 6"
            :key="i"
            class="flex-col"
            :class="shelfVisibility(i - 1)"
        >
          <!-- Poster skeleton (2:3 aspect ratio) -->
          <div class="mx-2 mt-4">
            <USkeleton class="aspect-[2/3] w-full rounded-none bg-white/10"/>
          </div>
          <div class="h-3 border-b-4 border-black/40 bg-shelf"/>
          <!-- Title and original title skeleton -->
          <div class="space-y-2 px-2 pt-3 pb-2">
            <USkeleton class="h-4 w-5/6 rounded-none bg-white/10"/>
            <USkeleton class="h-3 w-1/2 rounded-none bg-white/10"/>
          </div>
        </div>
      </template>
    </div>

    <MediaContentModal v-model="isModalOpen" :media="selectedMedia"/>
  </section>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import type {MediaIndexItem} from '~/models/indexes/media-index-item.ts'
import {FilmbaratokCategory} from '~/models/enums.ts'
import PosterStickers from "~/components/poster-stickers.vue";
import MediaContentModal from '~/components/media-content-modal.vue'
import {getYouTubeUrl} from "~/utils/get-youtube-url.ts";

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w342'

const props = defineProps({
  indexMedias: {
    type: Array as PropType<MediaIndexItem[]>,
    required: true,
  }
})

const seededRandom = useSeededRandom()
const selectedMedia = ref<MediaIndexItem | null>(null)
const isModalOpen = ref(false)

const medias = computed<MediaIndexItem[]>(() => {
  if (!props.indexMedias?.length) {
    return []
  }

  const relevantMedias = props.indexMedias.filter(media =>
      media.posterPath && media.contents?.some(content =>
          content.category === FilmbaratokCategory.PODCAST ||
          content.category === FilmbaratokCategory.EXPRESS
      )
  )

  const numberOfMedia = 10;
  return seededRandom.getDailyShuffle(relevantMedias).slice(0, numberOfMedia)
})

// Show exactly as many films as fit in one row (two rows on phones), so the shelf never scrolls
function shelfVisibility(index: number) {
  if (index < 3) return 'flex'
  if (index === 3) return 'flex sm:hidden md:flex'
  if (index < 6) return 'hidden lg:flex'
  return 'hidden'
}

function handleMediaSelect(media: MediaIndexItem) {
  if (!media.contents || media.contents.length === 0) {
    return
  }

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
</script>
