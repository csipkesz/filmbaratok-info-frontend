<template>
  <div
      class="relative overflow-hidden rounded-2xl bg-ink-soft/80 border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl"
  >
    <div class="space-y-4">
      <!-- Fejléc -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-marquee">
          <UIcon name="i-lucide-sparkles" class="w-4 h-4"/>
          <span>A nap témája</span>
        </div>

        <!-- Inline Spoiler indikátor -->
        <div
            v-if="dailyMedia && hasSpoiler"
            class="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[11px] font-medium text-rose-400"
        >
          <UIcon name="i-lucide-alert-triangle" class="w-3.5 h-3.5 shrink-0"/>
          <span>Spoileres kibeszélő</span>
        </div>
      </div>

      <!-- BETÖLTÖTT TARTALOM -->
      <div v-if="dailyMedia" class="flex gap-5 items-start pt-2">
        <div class="relative shrink-0">
          <template v-if="dailyMedia.posterPath">
            <img
                :src="`${TMDB_POSTER_BASE}${dailyMedia.posterPath}`"
                alt=""
                class="absolute inset-0 h-full w-full rounded-lg object-cover blur-md opacity-40 scale-95"
            />
            <img
                :src="`${TMDB_POSTER_BASE}${dailyMedia.posterPath}`"
                :alt="dailyMedia.title"
                class="relative w-24 h-36 object-cover rounded-lg border border-white/10 shadow-md"
            />
          </template>

          <div
              v-else
              class="w-24 h-36 flex flex-col items-center justify-center p-2 text-center rounded-lg bg-white/5 border border-white/10 shadow-md shrink-0"
          >
            <UIcon name="i-lucide-film" class="w-8 h-8 text-fog/40 mb-1 shrink-0"/>
            <span class="font-body text-[10px] font-semibold text-paper/80 line-clamp-2 leading-tight">
              {{ dailyMedia.title }}
            </span>
          </div>

          <!-- Borítóra illesztett diszkrét SPOILER badge -->
          <div
              v-if="hasSpoiler"
              class="absolute top-1.5 right-1.5 z-10 rounded bg-black/85 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-rose-400 border border-rose-500/30 uppercase"
          >
            Spoiler
          </div>
        </div>

        <div class="space-y-1.5 flex-1">
          <h3 class="font-display text-2xl font-bold text-paper">
            {{ dailyMedia.title }}
          </h3>

          <!-- Eredeti cím + Megjelenési év -->
          <p v-if="dailyMedia.originalTitle" class="text-xs text-fog italic">
            {{ dailyMedia.originalTitle }}
            <span v-if="releaseYear">({{ releaseYear }})</span>
          </p>

          <p class="font-body text-sm text-fog/90 line-clamp-3 leading-relaxed">
            {{ dailyMedia.overview }}
          </p>
        </div>
      </div>

      <!-- SKELETON BETÖLTÉSI ÁLLAPOT -->
      <div v-else class="flex gap-5 items-start pt-2">
        <USkeleton class="w-24 h-36 rounded-lg shrink-0 bg-white/10"/>

        <div class="space-y-2 flex-1 pt-1">
          <USkeleton class="h-7 w-3/4 rounded-md bg-white/10"/>
          <USkeleton class="h-4 w-1/2 rounded-md bg-white/10"/>
          <USkeleton class="h-4 w-2/3 rounded-md !mt-4 bg-white/10"/>
        </div>
      </div>
    </div>

    <!-- GOMB / GOMB SKELETON -->
    <div class="pt-2">
      <NuxtLink
          v-if="dailyMedia"
          @click="handleMediaSelect()"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-marquee/90 hover:bg-marquee text-ink font-semibold text-sm px-5 py-3 transition-all hover:shadow-md active:scale-95 cursor-pointer"
      >
        <span>Megnézem az adásokat</span>
        <UIcon name="i-lucide-arrow-right" class="w-4 h-4"/>
      </NuxtLink>

      <USkeleton v-else class="h-11 w-48 rounded-xl bg-white/10"/>
    </div>

    <MediaContentModal v-model="isModalOpen" :media="selectedMedia"/>
  </div>
</template>

<script setup lang="ts">
import type {MediaIndexItem} from "~/models/indexes/media-index-item.ts";
import type {MediaDetail} from "~/models/media-detail.ts";
import {ref} from "vue";
import MediaContentModal from "~/components/media-content-modal.vue";
import {getYouTubeUrl} from "~/utils/get-youtube-url.ts";

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

const props = defineProps({
  indexMedias: {
    type: Array as PropType<MediaIndexItem[]>,
    required: true,
  }
})

const seededRandom = useSeededRandom()

async function fetchDailyCommentaryContent(mediaId: string) {
  const mediaDetail = await $fetch<MediaDetail | null>(`/data/data/medias/${mediaId}.json`);
  if (!mediaDetail) {
    throw new Error(`Media detail not found: ${mediaId}`)
  }

  return mediaDetail;
}

const dailyMedia = ref<MediaDetail | null>(null)
const selectedMedia = ref<MediaIndexItem | null>(null)
const isModalOpen = ref(false)

// Év kiszámítása a releaseDate stringből
const releaseYear = computed(() => {
  if (!dailyMedia.value?.releaseDate) return null;
  return new Date(dailyMedia.value.releaseDate).getFullYear();
})

const hasSpoiler = computed(() => {
  if (!dailyMedia.value) {
    return false;
  }

  return dailyMedia.value.topics.some(t => t.isSpoiler) && dailyMedia.value.topics.length > 1;
})

watch(() => props.indexMedias, async (newIndexMedias) => {
  if (!newIndexMedias || newIndexMedias.length === 0) return;

  const randomIndex = seededRandom.getDailyIndex(newIndexMedias.length)
  const randomMedia = newIndexMedias[randomIndex] as MediaIndexItem

  try {
    dailyMedia.value = await fetchDailyCommentaryContent(randomMedia.id);
    selectedMedia.value = randomMedia
  } catch (error) {
    console.error("Hiba a napi téma betöltésekor:", error)
  }
}, {immediate: true})

function handleMediaSelect() {
  if (!selectedMedia.value || !selectedMedia.value.contents || selectedMedia.value.contents.length === 0) {
    return
  }

  if (selectedMedia.value.contents.length === 1) {
    const content = selectedMedia.value.contents[0]
    if (content?.youtubeId) {
      window.open(getYouTubeUrl(content.youtubeId, content.timestampInSeconds), '_blank', 'noopener,noreferrer')
    }
  } else {
    isModalOpen.value = true
  }
}
</script>