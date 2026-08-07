<script setup lang="ts">
import {onMounted, ref} from 'vue'
import LandingHero from "~/components/landing-hero.vue";
import LandingRandomMediaGrid from "~/components/landing-random-media-grid.vue";
import type {MediaIndexItem} from "~/models/media-index-item.ts";
import LandingDailyMediaCommentar from "~/components/landing-daily-media-commentar.vue";
import LandingDailyMedia from "~/components/landing-daily-media.vue";
import LandingDailyContent from "~/components/landing-daily-content.vue";

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
    
    <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <LandingDailyMedia :index-medias="indexMedias"/>

        <LandingDailyContent/>

      </div>
    </section>

  </div>
</template>