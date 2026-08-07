<template>
  <div
      class="relative overflow-hidden rounded-2xl bg-ink-soft/80 border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl"
  >
    <div class="space-y-4">
      <!-- Fejléc (Betöltés alatt is fixen látható) -->
      <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-marquee">
        <UIcon name="i-lucide-sparkles" class="w-4 h-4"/>
        <span>A nap témája</span>
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

          <!-- Hiányzó borító esetén placeholder -->
          <div
              v-else
              class="w-24 h-36 flex flex-col items-center justify-center p-2 text-center rounded-lg bg-white/5 border border-white/10 shadow-md shrink-0"
          >
            <UIcon name="i-lucide-film" class="w-8 h-8 text-fog/40 mb-1 shrink-0"/>
            <span class="font-body text-[10px] font-semibold text-paper/80 line-clamp-2 leading-tight">
              {{ dailyMedia.title }}
            </span>
          </div>
        </div>

        <div class="space-y-1.5 flex-1">
          <h3 class="font-display text-2xl font-bold text-paper">
            {{ dailyMedia.title }}
          </h3>
          <p v-if="dailyMedia.originalTitle" class="text-xs text-fog italic">
            {{ dailyMedia.originalTitle }}
          </p>
          <p v-if="dailyMedia.contents?.length" class="text-xs font-medium text-fog/80 pt-3">
            <span class="text-paper font-semibold">{{ dailyMedia.contents.length }}</span> kibeszélő adásban
            szerepel
          </p>
        </div>
      </div>

      <!-- SKELETON BETÖLTÉSI ÁLLAPOT -->
      <div v-else class="flex gap-5 items-start pt-2">
        <!-- Borító skeleton (w-24 h-36) -->
        <USkeleton class="w-24 h-36 rounded-lg shrink-0 bg-white/10"/>

        <!-- Szöveg blokk skeleton -->
        <div class="space-y-2 flex-1 pt-1">
          <!-- Cím -->
          <USkeleton class="h-7 w-3/4 rounded-md bg-white/10"/>
          <!-- Eredeti cím -->
          <USkeleton class="h-4 w-1/2 rounded-md bg-white/10"/>
          <!-- Kibeszélő adások száma -->
          <USkeleton class="h-4 w-2/3 rounded-md !mt-4 bg-white/10"/>
        </div>
      </div>
    </div>

    <!-- GOMB / GOMB SKELETON -->
    <div class="pt-2">
      <NuxtLink
          v-if="dailyMedia"
          :to="`/kereses?q=${encodeURIComponent(dailyMedia.title)}`"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-marquee/90 hover:bg-marquee text-ink font-semibold text-sm px-5 py-3 transition-all hover:shadow-md active:scale-95"
      >
        <span>Megnézem az adásokat</span>
        <UIcon name="i-lucide-arrow-right" class="w-4 h-4"/>
      </NuxtLink>

      <USkeleton v-else class="h-11 w-48 rounded-xl bg-white/10"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {MediaIndexItem} from "~/models/media-index-item.ts";

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

const props = defineProps({
  indexMedias: {
    type: Array as PropType<MediaIndexItem[]>,
    required: true,
  }
})

const seededRandom = useSeededRandom()

const dailyMedia = ref<MediaIndexItem | null>(null)
watch(() => props.indexMedias, async (newIndexMedias) => {
  const randomIndex = seededRandom.getDailyIndex(newIndexMedias.length)
  dailyMedia.value = newIndexMedias[randomIndex] as MediaIndexItem
})
</script>

<style scoped>

</style>