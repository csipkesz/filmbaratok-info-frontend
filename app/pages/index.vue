<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import LandingHero from "~/components/landing-hero.vue";
import LandingRandomMediaGrid from "~/components/landing-random-media-grid.vue";
import LandingDailyMediaCommentar from "~/components/landing-daily-media-commentar.vue";
import LandingDailyMedia from "~/components/landing-daily-media.vue";
import LandingDailyContent from "~/components/landing-daily-content.vue";
import SearchResultGrid from "~/components/search-result-grid.vue";
import type {MediaIndexItem} from "~/models/indexes/media-index-item.ts";
import type {ContentIndexItem} from "~/models/indexes/content-index-item.ts";

useHead({
  title: 'Filmbarátok Info - Archívum és Kereső',
  meta: [
    { name: 'description', content: 'Keresd meg és fedezd fel a Filmbarátok podcast adásaiban kibeszélt filmeket és sorozatokat.' }
  ]
})

const indexMedias = ref<MediaIndexItem[]>([])
const indexContents = ref<ContentIndexItem[]>([])

// Local reactive search query state (NO router synchronization)
const searchQuery = ref('')

// Keresési állapot detektálása
const isSearching = computed(() => searchQuery.value.trim().length > 0)

onMounted(async () => {
  try {
    const mediaIndex = await $fetch<MediaIndexItem[]>('/data/index/medias.json')
    indexMedias.value = mediaIndex || [];
  } catch (e) {
    console.error('Error loading on medias index: ', e)
  }

  try {
    const contentIndex = await $fetch<ContentIndexItem[]>('/data/index/contents.json')
    indexContents.value = contentIndex || [];
  } catch (e) {
    console.error('Error loading on contents index: ', e)
  }
})
</script>

<template>
  <div class="bg-ink min-h-screen text-paper">
    <LandingHero v-model:search-query="searchQuery"/>

    <!-- DYNAMIC SEARCH STATE SWITCH -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      <SearchResultGrid
          v-if="isSearching"
          :search-query="searchQuery"
          :index-medias="indexMedias"
          @clear="searchQuery = ''"
      />

      <template v-else>
        <LandingRandomMediaGrid :index-medias="indexMedias"/>

        <LandingDailyMediaCommentar :index-medias="indexMedias"/>

        <section class="py-8 pb-16">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LandingDailyMedia :index-medias="indexMedias"/>
            <LandingDailyContent :index-contents="indexContents"/>
          </div>
        </section>
      </template>

    </main>
  </div>
</template>