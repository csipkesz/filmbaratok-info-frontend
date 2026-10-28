<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import LandingHero from "~/components/landing-hero.vue";
import LandingRandomMediaGrid from "~/components/landing-random-media-grid.vue";
import LandingDailyMediaCommentar from "~/components/landing-daily-media-commentar.vue";
import LandingDailyMedia from "~/components/landing-daily-media.vue";
import LandingDailyContent from "~/components/landing-daily-content.vue";
import LandingLatestEpisode from "~/components/landing-latest-episode.vue";
import SearchResultGrid from "~/components/search-result-grid.vue";
import type {MediaIndexItem} from "~/models/indexes/media-index-item.ts";
import type {ContentIndexItem} from "~/models/indexes/content-index-item.ts";
import {useJsonRepo} from "~/composables/use-json-repo.ts";

useHead({
  title: 'Filmbarátok Téka',
  meta: [
    {
      name: 'description',
      content: 'Keresd meg és fedezd fel a Filmbarátok podcast adásaiban kibeszélt filmeket és sorozatokat.'
    }
  ]
})

const indexMedias = ref<MediaIndexItem[]>([])
const indexContents = ref<ContentIndexItem[]>([])
const jsonRepo = useJsonRepo();

// Local reactive search query state (NO router synchronization)
const searchQuery = ref('')

// Detect search state
const isSearching = computed(() => searchQuery.value.trim().length > 0)

onMounted(async () => {
  indexMedias.value = await jsonRepo.fetchIndex('medias');
  indexContents.value = await jsonRepo.fetchIndex('contents');
})
</script>

<template>
  <div>
    <LandingHero v-model:search-query="searchQuery"/>

    <!-- DYNAMIC SEARCH STATE SWITCH -->
    <div class="mx-auto max-w-6xl px-4 pb-12 sm:px-6">

      <SearchResultGrid
          v-if="isSearching"
          :search-query="searchQuery"
          :index-medias="indexMedias"
          @clear="searchQuery = ''"
      />

      <template v-else>
        <LandingRandomMediaGrid :index-medias="indexMedias"/>

        <LandingDailyMediaCommentar :index-medias="indexMedias"/>

        <section class="py-8">
          <div class="grid gap-6 md:grid-cols-2">
            <LandingDailyMedia :index-medias="indexMedias"/>
            <LandingDailyContent :index-contents="indexContents"/>
          </div>
        </section>

        <LandingLatestEpisode :index-medias="indexMedias" :index-contents="indexContents"/>
      </template>

    </div>
  </div>
</template>
