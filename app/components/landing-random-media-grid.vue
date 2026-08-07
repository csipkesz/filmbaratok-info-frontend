<template>
  <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper">
          Erről is beszéltek a srácok
        </h2>
        <p class="text-sm text-fog mt-1">
          Néhány érdekesség a több száz átbeszélt film és sorozat közül
        </p>
      </div>

      <NuxtLink
          to="/kereses"
          class="hidden sm:flex items-center gap-1 text-sm font-medium text-marquee hover:underline"
      >
        Összes böngészése
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4"/>
      </NuxtLink>
    </div>

    <!-- BETÖLTÖTT TARTALOM -->
    <UScrollArea
        v-if="medias.length > 0"
        v-slot="{ item: media }"
        :items="medias"
        orientation="horizontal"
        class="w-full"
        :ui="{ viewport: 'flex gap-2 sm:gap-3 pb-2' }"
    >
      <div
          class="group relative flex w-40 sm:w-48 shrink-0 flex-col overflow-hidden rounded-xl bg-ink-soft/40 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
      >
        <div class="aspect-[2/3] w-full overflow-hidden bg-ink-soft relative shrink-0">
          <img
              v-if="media.posterPath"
              :src="`${TMDB_POSTER_BASE}${media.posterPath}`"
              :alt="media.title"
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
          />
          <div
              v-else
              class="h-full w-full flex flex-col items-center justify-center p-4 text-center bg-white/5 border-b border-white/5"
          >
            <UIcon name="i-lucide-film" class="w-8 h-8 text-fog/40 mb-2 shrink-0"/>
            <span class="font-body text-xs font-semibold text-paper/90 line-clamp-3 leading-snug">
              {{ media.title }}
            </span>
          </div>

          <div
              class="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80 pointer-events-none"/>

          <span
              v-if="media.contents?.length"
              class="absolute bottom-2 right-2 rounded-md bg-ink/80 backdrop-blur px-2 py-0.5 text-xs font-mono text-fog border border-white/10"
          >
            {{ media.contents.length }} adás
          </span>
        </div>

        <div class="p-3 flex flex-col justify-start min-h-[4.25rem]">
          <h3 class="font-body text-sm font-semibold text-paper line-clamp-1 group-hover:text-marquee transition-colors">
            {{ media.title }}
          </h3>
          <p v-if="media.originalTitle" class="text-xs text-fog italic line-clamp-1 mt-0.5">
            {{ media.originalTitle }}
          </p>
        </div>
      </div>
    </UScrollArea>

    <!-- SKELETON BETÖLTÉSI ÁLLAPOT (6 KÁRTYA) -->
    <div v-else class="flex gap-2 sm:gap-3 overflow-hidden pb-2">
      <div
          v-for="i in 6"
          :key="i"
          class="flex w-40 sm:w-48 shrink-0 flex-col overflow-hidden rounded-xl bg-ink-soft/40 border border-white/5"
      >
        <!-- Poszter skeleton (2:3 képarány) -->
        <USkeleton class="aspect-[2/3] w-full rounded-none bg-white/10 shrink-0"/>

        <!-- Szöveg blokk skeleton -->
        <div class="p-3 flex flex-col justify-start min-h-[4.25rem] space-y-2">
          <!-- Cím skeleton -->
          <USkeleton class="h-4 w-5/6 rounded bg-white/10"/>
          <!-- Eredeti cím skeleton -->
          <USkeleton class="h-3 w-1/2 rounded bg-white/10"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type {MediaIndexItem} from "~/models/media-index-item.ts";
import {FilmbaratokCategory} from "~/models/enums.ts";

const props = defineProps({
  indexMedias: {
    type: Array as PropType<MediaIndexItem[]>,
    required: true,
  }
})

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

const medias = computed<MediaIndexItem[]>(() => {
  if (!props.indexMedias?.length) {
    return [];
  }

  const relevantMedias = props.indexMedias.filter(media =>
      media.contents?.some(content =>
          content.category === FilmbaratokCategory.PODCAST ||
          content.category === FilmbaratokCategory.EXPRESS
      )
  );
  const shuffled = [...relevantMedias].sort(() => 0.5 - Math.random())

  return shuffled.slice(0, 6);
})
</script>