<template>
  <UModal
      v-model:open="isOpen"
      :title="media?.title || 'Adások listája'"
      :ui="{ content: 'max-w-2xl overflow-hidden rounded-none border-4 border-black bg-teka ring-0' }"
  >
    <template #content>
      <div v-if="media">
        <!-- HEADER: faded backdrop with the poster and the short overview -->
        <div class="relative h-36">
          <img
              v-if="media.backdropPath"
              :src="`${TMDB_BACKDROP_BASE}${media.backdropPath}`"
              alt=""
              class="h-full w-full object-cover opacity-50"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-teka to-transparent"/>
          <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              class="absolute right-3 top-3"
              aria-label="Bezárás"
              @click="isOpen = false"
          />
        </div>

        <div class="relative -mt-24 flex items-start gap-5 px-6">
          <img
              v-if="media.posterPath"
              :src="`${TMDB_POSTER_BASE}${media.posterPath}`"
              :alt="media.title"
              class="w-28 shrink-0 border-4 border-black shadow-xl"
          />
          <div
              v-else
              class="flex aspect-[2/3] w-28 shrink-0 items-center justify-center border-4 border-black bg-stone-800"
          >
            <UIcon name="i-lucide-film" class="size-8 text-stone-500"/>
          </div>

          <div class="min-w-0 flex-1 pt-12">
            <h3 class="font-poster text-3xl uppercase leading-none">{{ media.title }}</h3>
            <p v-if="media.originalTitle" class="italic text-stone-400">{{ media.originalTitle }}</p>
            <p class="mt-1 text-sm text-primary">{{ media.contents?.length || 0 }} alkalommal beszéltek róla</p>
          </div>
        </div>

        <p v-if="overview" class="line-clamp-3 px-6 pt-4 text-sm text-stone-300">{{ overview }}</p>

        <!-- EPISODES: every row opens YouTube at the timestamp where the film comes up -->
        <div class="max-h-[55vh] space-y-3 overflow-y-auto p-6">
          <a
              v-for="content in media.contents"
              :key="`${content.id}-${content.timestampInSeconds}`"
              :href="getYouTubeUrl(content.youtubeId, content.timestampInSeconds)"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex gap-4"
          >
            <span class="relative w-28 shrink-0 sm:w-32">
              <img
                  :src="`https://i.ytimg.com/vi/${content.youtubeId}/mqdefault.jpg`"
                  alt=""
                  class="aspect-video w-full border-2 border-black bg-stone-800 object-cover"
                  loading="lazy"
              />
              <span class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <span class="flex size-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                  <UIcon name="i-lucide-play" class="size-6 translate-x-px text-primary"/>
                </span>
              </span>
              <span
                  v-if="content.timestampInSeconds"
                  class="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 text-xs font-semibold backdrop-blur-sm"
              >
                {{ formatTimestamp(content.timestampInSeconds) }}
              </span>
              <span
                  v-if="content.isSpoiler"
                  class="absolute -left-1 -top-1 bg-spoiler px-1.5 py-0.5 font-poster text-xs uppercase text-white"
              >
                Spoiler
              </span>
            </span>

            <span class="min-w-0 space-y-1">
              <span class="block font-poster text-xs uppercase tracking-wider text-primary">{{ formatCategory(content.category) }}</span>
              <span class="block font-semibold leading-tight group-hover:text-primary">{{ content.subtitle || content.title }}</span>
              <span v-if="content.participants?.length" class="block text-sm text-stone-400">{{ content.participants.join(', ') }}</span>
            </span>
          </a>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import type {MediaIndexItem} from '~/models/indexes/media-index-item.ts'
import {getYouTubeUrl} from "~/utils/get-youtube-url.ts";
import {formatCategory} from "~/utils/format-category.ts";

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w342'
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  media: {
    type: Object as PropType<MediaIndexItem | null>,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const jsonRepo = useJsonRepo()
const overview = ref<string | null>(null)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

// The index has no overview, so it is loaded from the media detail when the popup opens
watch(() => [isOpen.value, props.media?.id] as const, async ([open, mediaId]) => {
  if (!open || !mediaId) {
    return
  }

  overview.value = null
  const detail = await jsonRepo.fetchMediaDetail(mediaId)
  if (props.media?.id === mediaId) {
    overview.value = detail?.overview ?? null
  }
}, {immediate: true})

// TODO: We have it at server, but stay for now.
function formatTimestamp(seconds?: number): string {
  if (!seconds) return ''
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${mins}:${String(secs).padStart(2, '0')}`
}
</script>
