<template>
  <div
      class="relative overflow-hidden rounded-2xl bg-ink-soft/80 border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl"
  >
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
          <UIcon name="i-lucide-radio" class="w-4 h-4"/>
          <span>A nap adása</span>
        </div>

        <!-- Category Badge -->
        <div
            v-if="dailyContent"
            class="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-fog/90"
        >
          {{ formatCategory(dailyContent.category) }}
        </div>
      </div>

      <!-- LOADED CONTENT (Reversed layout: Text on the left, Thumbnail on the right) -->
      <div v-if="dailyContent" class="flex flex-col sm:flex-row-reverse gap-5 items-start pt-2">
        <!-- Thumbnail / Cover Image on the Right -->
        <a
            :href="`https://youtu.be/${dailyContent.youtubeId}`"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative w-full sm:w-36 aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black/40 shrink-0 shadow-md"
        >
          <img
              v-if="dailyContent.thumbnailUrl"
              :src="dailyContent.thumbnailUrl"
              :alt="dailyContent.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="h-full w-full flex items-center justify-center bg-white/5 text-fog/40">
            <UIcon name="i-lucide-mic" class="w-8 h-8"/>
          </div>

          <!-- Hover Play overlay -->
          <div
              class="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-colors group-hover:bg-black/10">
            <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
              <UIcon name="i-lucide-play" class="h-5 w-5 fill-current translate-x-0.5"/>
            </div>
          </div>
        </a>

        <!-- Title, Date, and Participants on the Left -->
        <div class="space-y-2 flex-1 w-full">
          <h3 class="font-display text-xl sm:text-2xl font-bold text-paper leading-tight">
            {{ dailyContent.title }}
          </h3>

          <p v-if="formattedDate" class="text-xs font-mono text-amber-400/90 flex items-center gap-1.5">
            <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5"/>
            <span>{{ formattedDate }}</span>
          </p>

          <!-- Optional participants list -->
          <div v-if="dailyContent.participants && dailyContent.participants.length > 0" class="pt-2">
            <p class="text-[11px] font-medium text-fog/60 mb-1">Műsorvezetők / Résztvevők:</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                  v-for="person in dailyContent.participants"
                  :key="person"
                  class="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-fog border border-white/10"
              >
                <UIcon name="i-lucide-user" class="w-3 h-3 text-amber-400/80"/>
                {{ person }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- SKELETON LOADING STATE (Mirrors the reversed layout structure) -->
      <div v-else class="flex flex-col sm:flex-row-reverse gap-5 items-start pt-2">
        <!-- Thumbnail skeleton (Right side) -->
        <USkeleton class="w-full sm:w-36 aspect-video sm:aspect-[4/3] rounded-xl shrink-0 bg-white/10"/>

        <!-- Text metadata skeleton (Left side) -->
        <div class="space-y-3 flex-1 w-full">
          <!-- Title -->
          <USkeleton class="h-7 w-3/4 rounded-md bg-white/10"/>
          <!-- Date -->
          <USkeleton class="h-4 w-1/3 rounded-md bg-white/10"/>

          <!-- Participants chips skeleton -->
          <div class="space-y-1.5 pt-2">
            <USkeleton class="h-3 w-1/4 rounded bg-white/10"/>
            <div class="flex gap-1.5">
              <USkeleton class="h-6 w-20 rounded-md bg-white/10"/>
              <USkeleton class="h-6 w-20 rounded-md bg-white/10"/>
              <USkeleton class="h-6 w-20 rounded-md bg-white/10"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BUTTON / BUTTON SKELETON -->
    <div class="pt-2">
      <a
          v-if="dailyContent"
          :href="`https://youtu.be/${dailyContent.youtubeId}`"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm px-5 py-3 transition-all hover:shadow-lg hover:shadow-red-950/30 active:scale-95"
      >
        <UIcon name="i-lucide-play" class="w-4 h-4 fill-current"/>
        <span>Adás megnyitása</span>
      </a>

      <USkeleton v-else class="h-11 w-44 rounded-xl bg-white/10"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {ContentIndexItem} from "~/models/indexes/content-index-item.ts";
import {formatCategory} from "~/utils/format-category.ts";

const seededRandom = useSeededRandom()

const props = defineProps({
  indexContents: {
    type: Array as PropType<ContentIndexItem[]>,
    required: true,
  }
})

const dailyContent = ref<ContentIndexItem | null>(null)

// Format date into human-readable Hungarian format (e.g., 2025. márc. 23.)
const formattedDate = computed(() => {
  if (!dailyContent.value?.releaseDate) return null;
  const date = new Date(dailyContent.value.releaseDate);
  return new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
})

watch(() => props.indexContents, async (newIndexContents) => {
  if (!newIndexContents || newIndexContents.length === 0) {
    return;
  }

  const randomIndex = seededRandom.getDailyIndex(newIndexContents.length)
  dailyContent.value = newIndexContents[randomIndex] as ContentIndexItem;
}, {immediate: true})

</script>

<style scoped>

</style>