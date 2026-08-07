<template>
  <div class="flex min-h-screen flex-col bg-ink">
    <AppNavbar/>
    <main class="flex-1">
      <slot/>
    </main>
    <AppFooter/>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from "~/components/layout/AppNavbar.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
</script>