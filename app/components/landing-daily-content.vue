<template>
  <div>
    <!-- LOADED CONTENT -->
    <BackdropCard
        v-if="dailyContent"
        :image="dailyContent.thumbnailUrl"
        class="h-full w-full"
        @click="openContent"
    >
      <span class="font-poster uppercase tracking-wider text-primary">A nap adása</span>
      <span class="line-clamp-2 min-h-[4.5rem] font-poster text-4xl uppercase leading-none">{{ dailyContent.title }}</span>
      <span v-if="formattedDate" class="text-stone-300">{{ formattedDate }}</span>
      <span v-if="dailyContent.participants?.length" class="mt-2 text-stone-300">{{ dailyContent.participants.join(', ') }}</span>
      <WatchLabel class="mt-3"/>
    </BackdropCard>

    <!-- SKELETON LOADING STATE -->
    <div v-else class="flex h-full min-h-96 flex-col justify-end gap-2 border-4 border-black p-6">
      <USkeleton class="h-5 w-32 rounded-none bg-white/10"/>
      <USkeleton class="h-10 w-3/4 rounded-none bg-white/10"/>
      <USkeleton class="h-4 w-1/3 rounded-none bg-white/10"/>
      <USkeleton class="mt-2 h-4 w-2/3 rounded-none bg-white/10"/>
      <!-- Button skeleton -->
      <USkeleton class="mt-3 h-9 w-32 rounded-none bg-white/10"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {ContentIndexItem} from "~/models/indexes/content-index-item.ts";
import {FilmbaratokCategory} from "~/models/enums.ts";
import BackdropCard from "~/components/backdrop-card.vue";
import WatchLabel from "~/components/watch-label.vue";
import {getYouTubeUrl} from "~/utils/get-youtube-url.ts";

const seededRandom = useSeededRandom()

const props = defineProps({
  indexContents: {
    type: Array as PropType<ContentIndexItem[]>,
    required: true,
  }
})

const dailyContent = ref<ContentIndexItem | null>(null)

// Date in Hungarian format (e.g. 2025. március 23.)
const formattedDate = computed(() => {
  if (!dailyContent.value?.releaseDate) return null;
  return new Date(dailyContent.value.releaseDate).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
})

watch(() => props.indexContents, (newIndexContents) => {
  if (!newIndexContents || newIndexContents.length === 0) {
    return;
  }

  const podcasts = newIndexContents.filter(c => c.category === FilmbaratokCategory.PODCAST)
  dailyContent.value = seededRandom.getDailyItem(podcasts);
}, {immediate: true})

function openContent() {
  if (!dailyContent.value) return
  window.open(getYouTubeUrl(dailyContent.value.youtubeId), '_blank', 'noopener,noreferrer')
}
</script>
