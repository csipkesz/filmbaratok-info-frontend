<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-end justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-red-400">
          A nap audiokommentárja
        </p>
        <h2 class="font-display text-2xl font-bold tracking-tight text-paper sm:text-3xl">
          Nézzük meg együtt!
        </h2>
      </div>
    </div>

    <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-soft/80 shadow-2xl">
      <!-- BETÖLTÖTT TARTALOM -->
      <template v-if="dailyCommentaryMedia && dailyCommentaryContent">
        <!-- Backdrop háttér -->
        <div class="absolute inset-0 z-0">
          <img
              v-if="dailyCommentaryMedia.backdropPath"
              :src="`${TMDB_BACKDROP_BASE}${dailyCommentaryMedia.backdropPath}`"
              alt=""
              class="h-full w-full object-cover opacity-30 filter blur-sm"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-ink-soft via-ink-soft/95 to-ink-soft/80"/>
        </div>

        <!-- Content GRID / Flex -->
        <div
            class="relative z-10 flex flex-col items-stretch justify-between gap-8 p-6 sm:p-10 lg:flex-row lg:items-center">

          <!-- Bal oldal: Film infók (Poszter + Cím + Leírás) -->
          <div class="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left flex-1">
            <!-- Film poszter -->
            <div class="relative shrink-0">
              <img
                  v-if="dailyCommentaryMedia.posterPath"
                  :src="`${TMDB_POSTER_BASE}${dailyCommentaryMedia.posterPath}`"
                  alt=""
                  class="absolute inset-0 h-full w-full rounded-xl object-cover blur-md opacity-40 scale-95"
              />
              <img
                  v-if="dailyCommentaryMedia.posterPath"
                  :src="`${TMDB_POSTER_BASE}${dailyCommentaryMedia.posterPath}`"
                  :alt="dailyCommentaryMedia.title"
                  class="relative h-60 w-40 rounded-xl border border-white/10 object-cover shadow-2xl"
              />
              <div
                  v-else
                  class="relative h-60 w-40 flex flex-col items-center justify-center p-3 text-center rounded-xl bg-white/5 border border-white/10 shadow-lg shrink-0"
              >
                <UIcon name="i-lucide-film" class="w-10 h-10 text-fog/40 mb-2 shrink-0"/>
                <span class="font-body text-xs font-semibold text-paper/80 line-clamp-3 leading-tight">
                  {{ dailyCommentaryMedia.title }}
                </span>
              </div>
            </div>

            <!-- Film és Adás részletek -->
            <div class="max-w-xl space-y-3 my-auto">
              <div>
                <h3 class="font-display text-2xl font-bold text-paper sm:text-3xl leading-tight">
                  {{ dailyCommentaryMedia.title }}
                </h3>
                <p v-if="dailyCommentaryMedia.originalTitle" class="text-xs text-fog italic mt-0.5">
                  {{ dailyCommentaryMedia.originalTitle }}
                </p>
              </div>

              <p class="font-body text-sm text-fog/90 line-clamp-3 leading-relaxed pt-1">
                {{ dailyCommentaryMedia.overview || 'Nincs leírás' }}
              </p>
            </div>
          </div>

          <div v-if="dailyCommentaryContent?.youtubeId" class="w-full shrink-0 md:w-auto">
            <a
                :href="`https://youtu.be/${dailyCommentaryContent.youtubeId}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2.5 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-red-500 hover:shadow-lg hover:shadow-red-900/30 active:scale-95"
            >
              <UIcon name="i-lucide-play" class="h-5 w-5 fill-current"/>
              <span>Audiokommentár megnyitása</span>
            </a>
          </div>
        </div>
      </template>

      <!-- SKELETON BETÖLTÉSI ÁLLAPOT -->
      <template v-else>
        <div
            class="relative z-10 flex flex-col items-stretch justify-between gap-8 p-6 sm:p-10 lg:flex-row lg:items-center">
          <div class="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left flex-1">
            <USkeleton class="h-60 w-40 rounded-xl shrink-0 bg-white/10"/>

            <div class="w-full max-w-xl space-y-3 my-auto">
              <USkeleton class="h-8 w-3/4 sm:w-2/3 rounded-md bg-white/10"/>
              <USkeleton class="h-4 w-1/3 rounded-md bg-white/10"/>
              <div class="space-y-2 pt-2">
                <USkeleton class="h-3.5 w-full rounded bg-white/10"/>
                <USkeleton class="h-3.5 w-5/6 rounded bg-white/10"/>
                <USkeleton class="h-3.5 w-4/6 rounded bg-white/10"/>
              </div>
            </div>
          </div>

          <!-- Gomb skeleton -->
          <div class="w-full shrink-0 md:w-auto">
            <USkeleton class="h-12 w-full md:w-56 rounded-xl bg-white/10"/>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import type {MediaIndexItem} from "~/models/indexes/media-index-item.ts";
import {FilmbaratokCategory} from "~/models/enums.ts";
import type {MediaDetail} from "~/models/media-detail.ts";
import type {ContentDetail} from "~/models/content-detail.ts";

const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'
const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

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