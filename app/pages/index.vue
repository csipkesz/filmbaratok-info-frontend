<script setup lang="ts">
import {onMounted, ref} from 'vue'
import LandingHero from "~/components/landing-hero.vue";
import LandingRandomMediaGrid from "~/components/landing-random-media-grid.vue";
import type {MediaIndexItem} from "~/models/media-index-item.ts";
import LandingDailyMediaCommentar from "~/components/landing-daily-media-commentar.vue";
import LandingDailyMedia from "~/components/landing-daily-media.vue";

const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'
const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

const indexMedias = ref<MediaIndexItem[]>([])

// Dátum alapú determinisztikus random generátor
function seededRandom(seed: number) {
  let t = (seed += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

onMounted(async () => {
  try {
    const mediaIndex = await $fetch<MediaIndexItem[]>('/data/index/medias.json')
    indexMedias.value = mediaIndex || [];

    if (mediaIndex && mediaIndex.length > 0) {
      // Dátum seed számítása (pl. 20260807)
      const todayStr = new Date().toISOString().split('T')[0]
      const seed = parseInt(todayStr.replace(/-/g, ''), 10)


    }
  } catch (err) {
    console.error('Nem sikerült betölteni a medias.json-t:', err)
  }
})
</script>

<template>
  <div class="bg-ink min-h-screen text-paper">
    <LandingHero/>

    <LandingRandomMediaGrid
        :index-medias="indexMedias"
    />

    <LandingDailyMediaCommentar :index-medias="indexMedias"/>

    <!-- 3. SZEKCIÓ: Napi Téma & A nap adása (KÉT HASÁB) -->
    <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- KÁRTYA 1: A mai nap témája -->
        <LandingDailyMedia :index-medias="indexMedias"/>

        <!-- KÁRTYA 2: A nap adása (Placeholder) -->
        <div
            class="relative overflow-hidden rounded-2xl bg-ink-soft/80 border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl"
        >
          <div class="space-y-4">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <UIcon name="i-lucide-radio" class="w-4 h-4"/>
              <span>A nap adása</span>
            </div>

            <div class="flex gap-5 items-start pt-2">
              <div
                  class="w-24 h-36 bg-white/5 rounded-lg shrink-0 border border-white/10 flex items-center justify-center text-fog/50"
              >
                <UIcon name="i-lucide-mic" class="w-8 h-8 opacity-40"/>
              </div>

              <div class="space-y-1.5 flex-1">
                <h3 class="font-display text-2xl font-bold text-paper">
                  Filmbarátok Podcast #250
                </h3>
                <p class="text-xs font-mono text-amber-400/90">
                  2024. 09. 12. • 275 perc
                </p>
                <p class="text-xs text-fog line-clamp-3 leading-relaxed pt-2">
                  Adás témái: Mátrix feltámadások, A Dűne 2. része és a legfrissebb filmipari hírek.
                </p>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <button
                disabled
                class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-fog/50 cursor-not-allowed opacity-60"
            >
              <UIcon name="i-lucide-play-circle" class="w-4 h-4"/>
              <span>Adás megnyitása (Hamarosan)</span>
            </button>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>