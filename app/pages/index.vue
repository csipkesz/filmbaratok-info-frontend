<script setup lang="ts">
import {onMounted, ref} from 'vue'

enum FilmbaratokCategory {
  PODCAST = 'PODCAST',
  ON_SITE = 'ON_SITE',
  EXPRESS = 'EXPRESS',
  AUDIO_COMMENTARY = 'AUDIO_COMMENTARY',
  GAME = 'GAME',
  OTHER = 'OTHER',
}

const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'
const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

const heroBackdrop = ref<string | null>(null)
const query = ref('')

const featuredMedias = ref<any[]>([])
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
  // 1. Hero Háttérkép
  try {
    const backdrops = await $fetch<string[]>('/data/data/backdrops.json')
    if (backdrops && backdrops.length > 0) {
      const randomIndex = Math.floor(Math.random() * backdrops.length)
      heroBackdrop.value = `${TMDB_BACKDROP_BASE}${backdrops[randomIndex]}`
    }
  } catch (err) {
    console.error('Nem sikerült betölteni a backdrops.json-t:', err)
  }

  // 2. Médiák betöltése & Szűrések
  try {
    const mediaIndex = await $fetch<any[]>('/data/index/medias.json')
    if (mediaIndex && mediaIndex.length > 0) {
      // Dátum seed számítása (pl. 20260807)
      const todayStr = new Date().toISOString().split('T')[0]
      const seed = parseInt(todayStr.replace(/-/g, ''), 10)

      // --- A) "Erről is beszéltek": Csak PODCAST vagy EXPRESS kategóriás elemek ---
      const podcastOrExpressMedias = mediaIndex.filter((media) =>
          media.contents?.some(
              (c: any) =>
                  c.category === FilmbaratokCategory.PODCAST ||
                  c.category === FilmbaratokCategory.EXPRESS
          )
      )
      const shuffled = [...podcastOrExpressMedias].sort(() => 0.5 - Math.random())
      featuredMedias.value = shuffled.slice(0, 6)

      // --- B) Determinikus napi általános média ---
      const dailyIndex = Math.floor(seededRandom(seed) * mediaIndex.length)
      dailyMedia.value = mediaIndex[dailyIndex]

      // --- C) "Nézd meg a srácokkal": AUDIO_COMMENTARY szűrés & kiválasztás ---
      const commentaryMedias = mediaIndex.filter((media) =>
          media.contents?.some(
              (c: any) => c.category === FilmbaratokCategory.AUDIO_COMMENTARY
          )
      )

      if (commentaryMedias.length > 0) {
        const commIndex = Math.floor(Math.random() * commentaryMedias.length)
        const selectedMedia = commentaryMedias[commIndex]

        dailyCommentaryMedia.value = selectedMedia
        dailyCommentaryContent.value = selectedMedia.contents?.find(
            (c: any) => c.category === FilmbaratokCategory.AUDIO_COMMENTARY
        )
      }
    }
  } catch (err) {
    console.error('Nem sikerült betölteni a medias.json-t:', err)
  }
})

function onSearch() {
  if (!query.value.trim()) return
  navigateTo({path: '/kereses', query: {q: query.value.trim()}})
}
</script>

<template>
  <div class="bg-ink min-h-screen text-paper">

    <!-- 1. SZEKCIÓ: Hero + Kereső -->
    <section
        class="relative isolate flex min-h-[55vh] sm:min-h-[60vh] items-center justify-center overflow-hidden bg-ink border-b border-white/5"
    >
      <div class="absolute inset-0">
        <img
            v-if="heroBackdrop"
            :src="heroBackdrop"
            alt=""
            class="h-full w-full object-cover opacity-75 transition-opacity duration-1000 motion-reduce:transition-none"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40"/>
        <div class="absolute inset-0 bg-gradient-to-r from-ink via-transparent to-ink"/>
      </div>

      <div class="relative z-10 mx-auto flex max-w-5xl w-full flex-col px-4 text-center items-center select-none py-12">
        <h1 class="font-display text-4xl leading-tight text-paper sm:text-5xl md:text-6xl">
          Szia, <span class="marquee-glow italic text-marquee">Filmbarát!</span>
        </h1>

        <p class="mt-4 max-w-lg font-body text-base text-fog sm:text-lg">
          Fedezd fel az eddig kibeszélt filmeket, sorozatokat.
        </p>

        <form class="mt-8 flex w-full max-w-2xl items-center" @submit.prevent="onSearch">
          <UInput
              v-model="query"
              size="xl"
              placeholder="Film, sorozat, vagy podcast szereplő..."
              icon="i-lucide-search"
              class="w-full [&_input]:rounded-full [&_input]:bg-ink-soft/80 [&_input]:backdrop-blur-md [&_input]:border-white/10 [&_input]:text-paper [&_input]:placeholder-fog [&_input]:py-4"
          >
            <template #trailing>
              <UButton
                  type="submit"
                  size="md"
                  color="warning"
                  class="shrink-0 rounded-full px-6 font-body font-medium"
                  icon="i-lucide-arrow-right"
              />
            </template>
          </UInput>
        </form>
      </div>
    </section>

    <!-- 2. SZEKCIÓ: Grid szalag (Csak PODCAST és EXPRESS) -->
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

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        <div
            v-for="media in featuredMedias"
            :key="media.id"
            class="group relative flex flex-col overflow-hidden rounded-xl bg-ink-soft/40 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
        >
          <div class="aspect-[2/3] w-full overflow-hidden bg-ink-soft relative">
            <img
                v-if="media.posterPath"
                :src="`${TMDB_POSTER_BASE}${media.posterPath}`"
                :alt="media.title"
                class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
            />
            <div v-else class="h-full w-full flex items-center justify-center text-fog text-xs p-2 text-center">
              Nincs borító
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80"/>

            <span
                v-if="media.contents?.length"
                class="absolute bottom-2 right-2 rounded-md bg-ink/80 backdrop-blur px-2 py-0.5 text-xs font-mono text-fog border border-white/10"
            >
              {{ media.contents.length }} adás
            </span>
          </div>

          <div class="p-3 flex flex-col justify-between flex-1">
            <h3 class="font-body text-sm font-semibold text-paper line-clamp-1 group-hover:text-marquee transition-colors">
              {{ media.title }}
            </h3>
            <p v-if="media.originalTitle" class="text-xs text-fog italic line-clamp-1 mt-0.5">
              {{ media.originalTitle }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- AUDIOKOMMENTÁR HERO SZEKCIÓ -->
    <section v-if="dailyCommentaryMedia" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-6 flex items-end justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-red-400">
            Napi audiokommentár
          </p>
          <h2 class="font-display text-2xl font-bold tracking-tight text-paper sm:text-3xl">
            Nézzük meg együtt!
          </h2>
        </div>
      </div>

      <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-soft/80 shadow-2xl">
        <!-- Háttér backdrop -->
        <div class="absolute inset-0 z-0">
          <img
              v-if="dailyCommentaryMedia.backdropPath"
              :src="`${TMDB_BACKDROP_BASE}${dailyCommentaryMedia.backdropPath}`"
              alt=""
              class="h-full w-full object-cover opacity-70 filter"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-ink-soft via-ink-soft/95 to-ink-soft/70"/>
        </div>

        <!-- Tartalom -->
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
            </div>

            <div class="max-w-xl space-y-2 my-1">
              <h3 class="font-display text-2xl font-bold text-paper sm:text-3xl">
                {{ dailyCommentaryMedia.title }}
              </h3>

              <p v-if="dailyCommentaryMedia.originalTitle || dailyCommentaryMedia.year" class="text-xs text-fog italic">
                {{ dailyCommentaryMedia.originalTitle }}
                <span v-if="dailyCommentaryMedia.year">({{ dailyCommentaryMedia.year }})</span>
              </p>

              <p v-if="dailyCommentaryMedia.overview"
                 class="pt-2 font-body text-sm text-fog line-clamp-3 leading-relaxed">
                {{ dailyCommentaryMedia.overview }}
              </p>

              <div v-if="dailyCommentaryContent?.participants?.length" class="pt-3 text-xs font-medium text-fog/80">
                <span class="text-paper">Kommentálják:</span> {{ dailyCommentaryContent.participants.join(', ') }}
              </div>
            </div>
          </div>

          <!-- Jobb oldal: YouTube indítás -->
          <div v-if="dailyCommentaryContent?.youtubeId" class="w-full shrink-0 md:w-auto">
            <a
                :href="`https://youtu.be/${dailyCommentaryContent.youtubeId}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2.5 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-red-500 hover:shadow-lg hover:shadow-red-900/30 active:scale-95"
            >
              <UIcon name="i-lucide-play" class="h-5 w-5 fill-current"/>
              <span>Audiokommentár indítása</span>
            </a>
          </div>
        </div>
      </div>
    </section>

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