<template>
  <!-- Pulled up under the navbar, so the backdrop starts at the top of the page -->
  <section class="relative isolate -mt-16 overflow-hidden pt-16">
    <div class="absolute inset-0 -z-10">
      <img
          v-if="heroBackdrop"
          :src="heroBackdrop"
          alt=""
          class="h-full w-full object-cover opacity-35 transition-opacity duration-1000 motion-reduce:transition-none"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-teka via-teka/70 to-teka/20"/>
    </div>

    <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-24 pb-12 sm:px-6">
      <h1 class="font-poster text-6xl uppercase leading-none sm:text-8xl">
        Szia, <span class="text-highlight">Filmbarát!</span>
      </h1>

      <p class="max-w-lg text-xl text-stone-300">
        Fedezd fel az eddig kibeszélt filmeket, sorozatokat.
      </p>

      <form class="w-full max-w-xl" @submit.prevent>
        <UInput
            v-model="inputQuery"
            size="xl"
            placeholder="Film, sorozat, vagy podcast szereplő..."
            icon="i-lucide-search"
            class="w-full"
            :ui="{ base: 'bg-black/50' }"
        >
          <template v-if="inputQuery.length" #trailing>
            <UButton
                size="sm"
                color="neutral"
                variant="link"
                icon="i-lucide-x"
                aria-label="Keresés törlése"
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
