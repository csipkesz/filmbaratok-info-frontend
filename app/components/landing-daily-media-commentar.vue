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
      <template v-if="dailyCommentaryMedia">
        <!-- backdrop -->
        <div class="absolute inset-0 z-0">
          <img
              v-if="dailyCommentaryMedia.backdropPath"
              :src="`${TMDB_BACKDROP_BASE}${dailyCommentaryMedia.backdropPath}`"
              alt=""
              class="h-full w-full object-cover opacity-70 filter"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-ink-soft via-ink-soft/95 to-ink-soft/70"/>
        </div>

        <!-- Content -->
        <div class="relative z-10 flex flex-col items-center justify-between gap-8 p-6 sm:p-10 md:flex-row">
          <div class="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <div class="relative shrink-0">
              <img
                  v-if="dailyCommentaryMedia.posterPath"
                  :src="`${TMDB_POSTER_BASE}${dailyCommentaryMedia.posterPath}`"
                  alt=""
                  class="absolute inset-0 h-full w-full rounded-xl object-cover blur-md opacity-50 scale-95"
              />
              <img
                  v-if="dailyCommentaryMedia.posterPath"
                  :src="`${TMDB_POSTER_BASE}${dailyCommentaryMedia.posterPath}`"
                  :alt="dailyCommentaryMedia.title"
                  class="relative h-62 w-40 rounded-xl border border-white/10 object-cover shadow-lg"
              />
              <!-- Placeholder hiányzó borító esetén -->
              <div
                  v-else
                  class="relative h-62 w-40 flex flex-col items-center justify-center p-3 text-center rounded-xl bg-white/5 border border-white/10 shadow-lg shrink-0"
              >
                <UIcon name="i-lucide-film" class="w-10 h-10 text-fog/40 mb-2 shrink-0"/>
                <span class="font-body text-xs font-semibold text-paper/80 line-clamp-3 leading-tight">
                  {{ dailyCommentaryMedia.title }}
                </span>
              </div>
            </div>

            <div class="max-w-xl space-y-2 my-1">
              <h3 class="font-display text-2xl font-bold text-paper sm:text-3xl">
                {{ dailyCommentaryMedia.title }}
              </h3>

              <p v-if="dailyCommentaryMedia.originalTitle" class="text-xs text-fog italic">
                {{ dailyCommentaryMedia.originalTitle }}
              </p>

              <p class="pt-2 font-body text-sm text-fog line-clamp-3 leading-relaxed">
                Lorem ipsum dolor met overview text long long description about movie hello.
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
        <div class="relative z-10 flex flex-col items-center justify-between gap-8 p-6 sm:p-10 md:flex-row">
          <div class="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left w-full">
            <!-- Borító skeleton (h-62 w-40) -->
            <USkeleton class="h-62 w-40 rounded-xl shrink-0 bg-white/10"/>

            <!-- Szöveges adatok skeleton -->
            <div class="w-full max-w-xl space-y-3 my-1">
              <!-- Cím -->
              <USkeleton class="h-8 w-3/4 sm:w-2/3 rounded-md bg-white/10"/>
              <!-- Eredeti cím -->
              <USkeleton class="h-4 w-1/3 rounded-md bg-white/10"/>

              <!-- Leírás (3 soros text block) -->
              <div class="space-y-2 pt-3">
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
import type {MediaIndexItem} from "~/models/media-index-item.ts";
import {FilmbaratokCategory} from "~/models/enums.ts";

const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'
const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

const props = defineProps({
  indexMedias: {
    type: Array as PropType<MediaIndexItem[]>,
    required: true,
  }
})

const dailyCommentaryMedia = ref<MediaIndexItem | null>(null)
const dailyCommentaryContent = ref<any | null>(null)

watch(() => props.indexMedias, async (newIndexMedias) => {
  if (newIndexMedias && newIndexMedias.length > 0) {
    const commentaryMedias = newIndexMedias.filter((media) =>
        media.contents?.some(
            (c) => c.category === FilmbaratokCategory.AUDIO_COMMENTARY
        )
    )

    if (commentaryMedias.length > 0) {
      const commIndex = Math.floor(Math.random() * commentaryMedias.length)
      const selectedMedia = commentaryMedias[commIndex] as MediaIndexItem

      dailyCommentaryMedia.value = selectedMedia
      dailyCommentaryContent.value = selectedMedia.contents?.find(
          (c) => c.category === FilmbaratokCategory.AUDIO_COMMENTARY
      )
    }
  }
}, {immediate: true})

</script>

<style scoped>

</style>