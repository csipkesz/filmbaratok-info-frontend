<script setup lang="ts">
const links = [
  // {label: 'Kibeszélt tartalmak', to: '/kibeszelt-tartalmak'},
  // {label: 'Epizódok', to: '/epizodok'},
  // {label: 'Szereplők', to: '/szereplok'},
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <NuxtLink to="/" class="font-display text-xl italic text-marquee">
        Filmbarátok info
      </NuxtLink>

      <nav class="hidden items-center gap-8 font-body text-sm text-fog sm:flex">
        <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="transition-colors hover:text-paper"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <UButton
          icon="i-lucide-search"
          color="neutral"
          variant="ghost"
          square
          class="text-paper sm:hidden"
          aria-label="Keresés"
      />
    </div>
  </header>
</template>