<template>
  <footer class="border-t border-white/10 bg-ink-soft/40">
    <div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="font-display text-lg italic text-marquee">Filmbarátok</p>
        <p class="mt-1 font-body text-sm text-fog">Kibeszélt filmek és sorozatok archívuma.</p>
      </div>

      <div class="flex items-center gap-4">
        <a href="https://www.youtube.com/@filmbaratokpodcast" target="_blank" rel="noopener"
           class="text-fog transition-colors hover:text-paper">
          <UIcon name="i-simple-icons-youtube" class="size-5"/>
        </a>
        <a href="https://open.spotify.com/" target="_blank" rel="noopener"
           class="text-fog transition-colors hover:text-paper">
          <UIcon name="i-simple-icons-spotify" class="size-5"/>
        </a>
      </div>
    </div>

    <div class="border-t border-white/5 px-6 py-4 text-center font-body text-xs text-fog/70">
      © {{ new Date().getFullYear() }} Filmbarátok Podcast
    </div>
  </footer>
</template>