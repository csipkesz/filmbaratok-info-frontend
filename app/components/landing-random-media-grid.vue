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
          to="/media"
          class="hidden sm:flex items-center gap-1 text-sm font-medium text-marquee hover:underline"
      >
        Összes böngészése
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4"/>
      </NuxtLink>
    </div>

    <UScrollArea
        v-if="medias.length > 0"
        v-slot="{ item: media }"
        :items="medias"
        orientation="horizontal"
        class="w-full"
        :ui="{ viewport: 'flex gap-2 sm:gap-3 pb-2' }"
    >
      <div class="w-40 sm:w-48 shrink-0">
        <MediaCard :media="media" @select="handleMediaSelect"/>
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

    <MediaContentModal v-model="isModalOpen" :media="selectedMedia"/>
  </section>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import type {MediaIndexItem} from '~/models/indexes/media-index-item.ts'
import {FilmbaratokCategory} from '~/models/enums.ts'
import MediaCard from '~/components/media-card.vue'
import MediaContentModal from '~/components/media-content-modal.vue'

const props = defineProps({
  indexMedias: {
    type: Array as PropType<MediaIndexItem[]>,
    required: true,
  }
})

const seededRandom = useSeededRandom()
const selectedMedia = ref<MediaIndexItem | null>(null)
const isModalOpen = ref(false)

const medias = computed<MediaIndexItem[]>(() => {
  if (!props.indexMedias?.length) {
    return []
  }

  const relevantMedias = props.indexMedias.filter(media =>
      media.contents?.some(content =>
          content.category === FilmbaratokCategory.PODCAST ||
          content.category === FilmbaratokCategory.EXPRESS
      )
  )

  const numberOfMedia = 10;
  const dailyRandomIndex = Math.max(seededRandom.getDailyIndex(relevantMedias.length) - numberOfMedia, 0)
  return [...relevantMedias].slice(dailyRandomIndex, dailyRandomIndex + numberOfMedia)
})

function handleMediaSelect(media: MediaIndexItem) {
  if (!media.contents || media.contents.length === 0) {
    return
  }

  if (media.contents.length === 1) {
    const content = media.contents[0]
    if (content?.youtubeId) {
      let url = `https://www.youtube.com/watch?v=${content.youtubeId}`
      if (content.timestampInSeconds) {
        url += `&t=${content.timestampInSeconds}s`
      }

      window.open(url, '_blank', 'noopener,noreferrer')
    }
  } else {
    selectedMedia.value = media
    isModalOpen.value = true
  }
}
</script>