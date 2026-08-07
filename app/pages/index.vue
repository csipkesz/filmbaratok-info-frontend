<script setup lang="ts">
import {onMounted, ref} from 'vue'
import LandingHero from "~/components/landing-hero.vue";
import LandingRandomMediaGrid from "~/components/landing-random-media-grid.vue";
import type {MediaIndexItem} from "~/models/media-index-item.ts";
import LandingDailyMediaCommentar from "~/components/landing-daily-media-commentar.vue";
import LandingDailyMedia from "~/components/landing-daily-media.vue";
import LandingDailyContent from "~/components/landing-daily-content.vue";

const indexMedias = ref<MediaIndexItem[]>([])

onMounted(async () => {
  try {
    const mediaIndex = await $fetch<MediaIndexItem[]>('/data/index/medias.json')
    indexMedias.value = mediaIndex || [];
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