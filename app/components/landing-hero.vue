<template>
  <section
      class="relative isolate flex min-h-[38vh] sm:min-h-[42vh] items-center justify-center overflow-hidden bg-ink border-b border-white/5"
  >
    <div class="absolute inset-0">
      <img
          v-if="heroBackdrop"
          :src="heroBackdrop"
          alt=""
          class="h-full w-full object-cover object-top opacity-55 transition-opacity duration-1000 motion-reduce:transition-none"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40"/>
      <div class="absolute inset-0 bg-gradient-to-r from-ink via-transparent to-ink"/>
    </div>

    <div
        class="relative z-10 mx-auto flex max-w-5xl w-full flex-col px-4 text-center items-center select-none pt-8 pb-6 sm:pt-10 sm:pb-8">
      <h1 class="font-display text-4xl leading-tight text-paper sm:text-5xl md:text-6xl">
        Szia, <span class="marquee-glow italic text-marquee">Filmbarát!</span>
      </h1>

      <p class="mt-3 max-w-lg font-body text-base text-fog sm:text-lg">
        Fedezd fel az eddig kibeszélt filmeket, sorozatokat.
      </p>

      <form class="mt-6 flex w-full max-w-2xl items-center" @submit.prevent>
        <UInput
            v-model="inputQuery"
            size="xl"
            placeholder="Film, sorozat, vagy podcast szereplő..."
            icon="i-lucide-search"
            class="w-full [&_input]:rounded-full [&_input]:bg-ink-soft/80 [&_input]:backdrop-blur-md [&_input]:border-white/10 [&_input]:text-paper [&_input]:placeholder-fog [&_input]:py-3.5"
        >
          <template v-if="inputQuery.length" #trailing>
            <UButton
                size="md"
                color="warning"
                class="shrink-0 rounded-full px-6 font-body font-medium cursor-pointer"
                icon="i-lsicon-clear-filled"
                @click="resetQuery"
            />
          </template>
        </UInput>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import {watchDebounced} from "@vueuse/core";

const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'
const jsonRepo = useJsonRepo()

const query = defineModel<string>('search-query', {default: ''})
const heroBackdrop = ref('')

const inputQuery = ref(query.value)

function resetQuery() {
  inputQuery.value = ''
  query.value = ''
}

watchDebounced(inputQuery, (newQuery) => {
  query.value = newQuery
}, {debounce: 300})

watch(query, (newVal) => {
  if (newVal !== inputQuery.value) {
    inputQuery.value = newVal
  }
})

onMounted(async () => {
  const backdrops = await jsonRepo.fetchBackdrops();
  if (!backdrops.length) {
    console.error('No backdrops found')
    return
  }

  const randomIndex = Math.floor(Math.random() * backdrops.length)
  heroBackdrop.value = `${TMDB_BACKDROP_BASE}${backdrops[randomIndex]}`

})
</script>

<style scoped>

</style>