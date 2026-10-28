<template>
  <section class="py-8">
    <!-- LOADED CONTENT -->
    <div v-if="dailyCommentaryMedia && dailyCommentaryContent" class="grid items-center gap-8 md:grid-cols-[auto_1fr]">
      <!-- Film poster with the "Mai ajánló" sticker -->
      <div class="relative mx-auto w-48">
        <img
            v-if="dailyCommentaryMedia.posterPath"
            :src="`${TMDB_POSTER_BASE}${dailyCommentaryMedia.posterPath}`"
            :alt="dailyCommentaryMedia.title"
            class="w-full border-4 border-black shadow-2xl"
        />
        <span class="absolute -right-6 -top-4 rotate-12 bg-primary px-3 py-2 font-poster uppercase leading-none text-black shadow-lg">
          Mai<br>ajánló
        </span>
      </div>

      <!-- Film and episode details -->
      <div class="flex flex-col gap-3">
        <h2 class="font-poster text-5xl uppercase leading-none">Nézzük meg együtt!</h2>
        <p class="text-xl font-semibold">{{ dailyCommentaryMedia.title }}</p>
        <p v-if="dailyCommentaryMedia.overview" class="line-clamp-3 max-w-xl text-stone-300">
          {{ dailyCommentaryMedia.overview }}
        </p>
        <UButton
            :to="`https://youtu.be/${dailyCommentaryContent.youtubeId}`"
            target="_blank"
            size="xl"
            icon="i-lucide-play"
            label="Audiokommentár indítása"
            class="self-start"
        />
      </div>
    </div>

    <!-- SKELETON LOADING STATE -->
    <div v-else class="grid items-center gap-8 md:grid-cols-[auto_1fr]">
      <USkeleton class="mx-auto aspect-[2/3] w-48 rounded-none bg-white/10"/>

      <div class="flex flex-col gap-3">
        <USkeleton class="h-12 w-3/4 rounded-none bg-white/10"/>
        <USkeleton class="h-6 w-1/3 rounded-none bg-white/10"/>
        <div class="max-w-xl space-y-2">
          <USkeleton class="h-4 w-full rounded-none bg-white/10"/>
          <USkeleton class="h-4 w-5/6 rounded-none bg-white/10"/>
          <USkeleton class="h-4 w-4/6 rounded-none bg-white/10"/>
        </div>
        <!-- Button skeleton -->
        <USkeleton class="h-11 w-60 rounded-none bg-white/10"/>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type {MediaIndexItem} from "~/models/indexes/media-index-item.ts";
import {FilmbaratokCategory} from "~/models/enums.ts";
import type {MediaDetail} from "~/models/media-detail.ts";
import type {ContentDetail} from "~/models/content-detail.ts";

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w342'

const props = defineProps({
  indexMedias: {
    type: Array as PropType<MediaIndexItem[]>,
    required: true,
  }
})

const dailyCommentaryMedia = ref<MediaDetail | null>(null)
const dailyCommentaryContent = ref<ContentDetail | null>(null)

const seededRandom = useSeededRandom()
const jsonRepo = useJsonRepo()

watch(() => props.indexMedias, async (newIndexMedias) => {
  if (newIndexMedias && newIndexMedias.length > 0) {
    const commentaryMedias = newIndexMedias.filter((media) =>
        media.contents?.some(
            (c) => c.category === FilmbaratokCategory.AUDIO_COMMENTARY
        )
    )

    if (commentaryMedias.length > 0) {
      const randomIndex = seededRandom.getDailyIndex(commentaryMedias.length)
      const selectedMedia = commentaryMedias[randomIndex] as MediaIndexItem

      const detail = await jsonRepo.fetchMediaDetail(selectedMedia.id);
      if (!detail) {
        throw new Error(`Media detail not found: ${selectedMedia.id}`)
      }
      dailyCommentaryMedia.value = detail

      dailyCommentaryContent.value = detail.topics
          .flatMap(t => t.content)
          .find((c) => c.category === FilmbaratokCategory.AUDIO_COMMENTARY) as ContentDetail

    }
  }
}, {immediate: true})
</script>
