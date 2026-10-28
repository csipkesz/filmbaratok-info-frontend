<template>
  <div class="theme-teka dark flex min-h-screen flex-col bg-teka font-text text-stone-100">
    <AppNavbar/>
    <main class="flex-1">
      <slot/>
    </main>
    <AppFooter/>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from "~/components/layout/app-navbar.vue";
import AppFooter from "~/components/layout/app-footer.vue";
</script>
