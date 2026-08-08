<script setup lang="ts">
const links = [
  {label: 'Összes film és sorozat', to: '/media'},
  // {label: 'Rólunk', to: '/rolunk'},
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <NuxtLink to="/" class="font-display text-xl italic text-marquee flex items-center gap-2">
        <span>Filmbarátok info</span>
      </NuxtLink>

      <nav class="flex items-center gap-6 sm:gap-8 font-body text-sm text-fog">
        <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="transition-colors hover:text-paper font-medium"
            active-class="text-marquee font-semibold"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>