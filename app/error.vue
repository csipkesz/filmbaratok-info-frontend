<template>
  <UApp>
    <NuxtLayout>
      <section class="mx-auto flex max-w-6xl flex-1 flex-col items-start justify-center gap-6 px-4 py-24 sm:px-6">
        <span class="-rotate-2 bg-primary px-3 py-1 font-poster text-2xl uppercase text-black shadow-[3px_3px_0_0_#000]">
          {{ error.statusCode }}
        </span>

        <h1 class="font-poster text-5xl uppercase leading-none sm:text-7xl">
          {{ isNotFound ? 'Ez a kazetta' : 'Elakadt' }}
          <span class="text-highlight">{{ isNotFound ? 'nincs a polcon' : 'a lejátszó' }}</span>
        </h1>

        <p class="max-w-lg text-xl text-stone-300">
          {{ isNotFound
            ? 'A keresett oldal nem létezik, vagy valaki elfelejtette visszahozni.'
            : 'Váratlan hiba történt. Próbáld újra egy kicsit később.' }}
        </p>

        <div class="flex flex-wrap gap-3">
          <UButton size="lg" icon="i-lucide-house" @click="goTo('/')">Vissza a főoldalra</UButton>
          <UButton size="lg" color="neutral" variant="outline" icon="i-lucide-film" @click="goTo('/media')">
            Összes film
          </UButton>
        </div>
      </section>
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app'

const props = defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true,
  },
})

const isNotFound = computed(() => props.error.statusCode === 404)

useHead({
  title: computed(() => isNotFound.value ? 'Nem található · Filmbarátok Téka' : 'Hiba · Filmbarátok Téka'),
})

function goTo(path: string) {
  clearError({redirect: path})
}
</script>
