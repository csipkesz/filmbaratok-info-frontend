<script setup lang="ts">
import {onMounted, ref} from 'vue'
import LandingHero from "~/components/landing-hero.vue";
import {FilmbaratokCategory} from "~/models/enums.ts";
import LandingRandomMediaGrid from "~/components/landing-random-media-grid.vue";
import type {MediaIndexItem} from "~/models/media-index-item.ts";
import LandingDailyMediaCommentar from "~/components/landing-daily-media-commentar.vue";

const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'
const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

const indexMedias = ref<MediaIndexItem[]>([])
const dailyMedia = ref<any | null>(null)

// Új: Napi Audio Commentary elem & ehhez tartozó tartalom-objektum
const dailyCommentaryMedia = ref<any | null>(null)
const dailyCommentaryContent = ref<any | null>(null)

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

      // --- B) Determinikus napi általános média ---
      const dailyIndex = Math.floor(seededRandom(seed) * mediaIndex.length)
      dailyMedia.value = mediaIndex[dailyIndex]

      // --- C) "Nézd meg a srácokkal": AUDIO_COMMENTARY szűrés & kiválasztás ---
      const commentaryMedias = mediaIndex.filter((media) =>
          media.contents?.some(
              (c: any) => c.category === FilmbaratokCategory.AUDIO_COMMENTARY
          )
      )


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
        <div
            class="relative overflow-hidden rounded-2xl bg-ink-soft/80 border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl"
        >
          <div class="space-y-4">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-marquee">
              <UIcon name="i-lucide-sparkles" class="w-4 h-4"/>
              <span>A nap témája</span>
            </div>

            <div v-if="dailyMedia" class="flex gap-5 items-start pt-2">
              <div class="relative shrink-0">
                <img
                    v-if="dailyMedia.posterPath"
                    :src="`${TMDB_POSTER_BASE}${dailyMedia.posterPath}`"
                    alt=""
                    class="absolute inset-0 h-full w-full rounded-lg object-cover blur-md opacity-40 scale-95"
                />
                <img
                    v-if="dailyMedia.posterPath"
                    :src="`${TMDB_POSTER_BASE}${dailyMedia.posterPath}`"
                    :alt="dailyMedia.title"
                    class="relative w-24 h-36 object-cover rounded-lg border border-white/10 shadow-md"
                />
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

            <div v-else class="text-fog text-sm py-8">
              Mai téma betöltése...
            </div>
          </div>

          <div class="pt-2">
            <NuxtLink
                v-if="dailyMedia"
                :to="`/kereses?q=${encodeURIComponent(dailyMedia.title)}`"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-marquee/90 hover:bg-marquee text-ink font-semibold text-sm px-5 py-3 transition-all hover:shadow-md active:scale-95"
            >
              <span>Megnézem az adásokat</span>
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4"/>
            </NuxtLink>
          </div>
        </div>

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