<script setup lang="ts">
import AppLogo from "~/components/layout/app-logo.vue";

const links = [
  {label: 'Összes film', to: '/media'},
  // {label: 'Rólunk', to: '/rolunk'},
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-teka/70 shadow-lg shadow-black/30 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <AppLogo/>
      <nav class="flex gap-1">
        <UButton
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            variant="ghost"
            color="neutral"
            active-color="primary"
            :label="link.label"
        />
      </nav>
    </div>
  </header>
</template>
