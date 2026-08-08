<template>
  <UModal v-model:open="isOpen" :title="media?.title || 'Adások listája'"
          class="bg-ink rounded-2xl border border-white/10">
    <template #content>
      <div v-if="media"
           class="p-6 space-y-6  text-paper  max-w-2xl w-full mx-auto">
        <div class="flex gap-4 items-start border-b border-white/10 pb-5">
          <div class="w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-ink-soft border border-white/10 shadow-md">
            <img
                v-if="media.posterPath"
                :src="`${TMDB_POSTER_BASE}${media.posterPath}`"
                :alt="media.title"
                class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-white/5 text-fog/40">
              <UIcon name="i-lucide-film" class="w-8 h-8"/>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-display text-xl font-bold text-paper leading-tight">
              {{ media.title }}
            </h3>
            <p v-if="media.originalTitle" class="text-xs text-fog italic mt-0.5">
              {{ media.originalTitle }}
            </p>
            <p class="text-xs text-marquee mt-2 font-mono flex items-center gap-1">
              <UIcon name="i-lucide-disc" class="w-3.5 h-3.5"/>
              <span>{{ media.contents?.length || 0 }} alkalommal beszéltek róla</span>
            </p>
          </div>

          <button
              @click="isOpen = false"
              class="rounded-lg p-1.5 text-fog hover:text-paper hover:bg-white/10 transition-colors"
              aria-label="Bezárás"
          >
            <UIcon name="i-lucide-x" class="w-5 h-5"/>
          </button>
        </div>

        <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div
              v-for="content in media.contents"
              :key="content.id"
              class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-ink-soft/80 border border-white/5 hover:border-white/20 transition-all duration-200"
          >
            <div class="space-y-2 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span
                    class="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-marquee border border-white/10">
                  {{ formatCategory(content.category) }}
                </span>
                <span
                    v-if="content.isSpoiler"
                    class="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-rose-300 border border-rose-500/30"
                >
                  Spoileres
                </span>
                <span v-if="content.timestampInSeconds" class="text-xs font-mono text-fog flex items-center gap-1">
                  <UIcon name="i-lucide-clock" class="w-3 h-3 text-amber-400"/>
                  {{ formatTimestamp(content.timestampInSeconds) }}
                </span>
              </div>

              <h4 class="font-body text-sm font-semibold text-paper group-hover:text-marquee transition-colors">
                {{ content.subtitle || content.title }}
              </h4>

              <div v-if="content.participants?.length" class="flex flex-wrap gap-1.5 pt-1">
                <span
                    v-for="person in content.participants"
                    :key="person"
                    class="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[11px] font-medium text-fog/80 border border-white/5"
                >
                  <UIcon name="i-lucide-user" class="w-2.5 h-2.5 text-fog/50"/>
                  {{ person }}
                </span>
              </div>
            </div>

            <a
                :href="getYouTubeUrl(content.youtubeId, content.timestampInSeconds)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-4 py-2.5 transition-all shadow-md hover:shadow-red-950/40 shrink-0 active:scale-95"
            >
              <UIcon name="i-lucide-play" class="w-4 h-4 fill-current"/>
              <span>Megnyitás YouTube-on</span>
            </a>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import type {MediaIndexItem} from '~/models/indexes/media-index-item.ts'

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

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

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

//TODO: i18n or composable
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

//TODO: Extract to composable or idk
function getYouTubeUrl(youtubeId: string, timestampInSeconds?: number): string {
  let url = `https://www.youtube.com/watch?v=${youtubeId}`
  if (timestampInSeconds && timestampInSeconds > 0) {
    url += `&t=${timestampInSeconds}s`
  }
  return url
}
</script>
