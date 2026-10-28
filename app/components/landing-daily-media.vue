<template>
  <div>
    <!-- LOADED CONTENT -->
    <BackdropCard
        v-if="dailyMedia && selectedMedia"
        :image="dailyMedia.backdropPath ? `${TMDB_BACKDROP_BASE}${dailyMedia.backdropPath}` : null"
        class="h-full w-full"
        @click="handleMediaSelect"
    >
      <span class="flex items-center gap-2">
        <span class="font-poster uppercase tracking-wider text-primary">A nap filmje</span>
        <span v-if="hasSpoiler" class="-rotate-2 bg-spoiler px-1.5 py-0.5 font-poster text-xs uppercase text-white">Spoiler</span>
      </span>
      <!-- Room for two lines, so a long title doesn't push the label out of line with the card next to it -->
      <span class="line-clamp-2 min-h-[4.5rem] font-poster text-4xl uppercase leading-none">{{ dailyMedia.title }}</span>
      <span v-if="dailyMedia.originalTitle" class="italic text-stone-300">{{ dailyMedia.originalTitle }}</span>
      <span v-if="dailyMedia.overview" class="mt-2 line-clamp-2 text-stone-300">{{ dailyMedia.overview }}</span>
      <span class="mt-2 text-sm text-stone-400">{{ selectedMedia.contents.length }} alkalommal beszéltek róla</span>
    </BackdropCard>

    <!-- SKELETON LOADING STATE -->
    <div v-else class="flex h-full min-h-96 flex-col justify-end gap-2 border-4 border-black p-6">
      <USkeleton class="h-5 w-32 rounded-none bg-white/10"/>
      <USkeleton class="h-10 w-3/4 rounded-none bg-white/10"/>
      <USkeleton class="h-4 w-1/3 rounded-none bg-white/10"/>
      <USkeleton class="mt-2 h-4 w-full rounded-none bg-white/10"/>
      <USkeleton class="h-4 w-5/6 rounded-none bg-white/10"/>
      <USkeleton class="mt-2 h-3 w-40 rounded-none bg-white/10"/>
    </div>

    <MediaContentModal v-model="isModalOpen" :media="selectedMedia"/>
  </div>
</template>

<script setup lang="ts">
import type {MediaIndexItem} from "~/models/indexes/media-index-item.ts";
import type {MediaDetail} from "~/models/media-detail.ts";
import {computed, ref} from "vue";
import BackdropCard from "~/components/backdrop-card.vue";
import MediaContentModal from "~/components/media-content-modal.vue";
import {getYouTubeUrl} from "~/utils/get-youtube-url.ts";

const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'

const props = defineProps({
  indexMedias: {
    type: Array as PropType<MediaIndexItem[]>,
    required: true,
  }
})

const seededRandom = useSeededRandom()
const jsonRepo = useJsonRepo()

const dailyMedia = ref<MediaDetail | null>(null)
const selectedMedia = ref<MediaIndexItem | null>(null)
const isModalOpen = ref(false)

// Same rule as the poster stickers, so the card warns before the modal or YouTube opens
const hasSpoiler = computed(() => selectedMedia.value?.contents.some(c => c.isSpoiler) ?? false)

watch(() => props.indexMedias, async (newIndexMedias) => {
  if (!newIndexMedias || newIndexMedias.length === 0) return;

  // Only films with a backdrop, since the card is built around it
  const mediasWithBackdrop = newIndexMedias.filter(media => media.posterPath && media.backdropPath)
  const randomMedia = seededRandom.getDailyShuffle(mediasWithBackdrop, 2)[0]
  if (!randomMedia) return;

  dailyMedia.value = await jsonRepo.fetchMediaDetail(randomMedia.id);
  if (!dailyMedia.value) {
    throw new Error('Daily media not found: ' + randomMedia.id)
  }

  selectedMedia.value = randomMedia
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
