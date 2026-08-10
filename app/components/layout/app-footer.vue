<template>
  <footer class="border-t border-white/10 bg-ink-soft/60 backdrop-blur">
    <div class="mx-auto max-w-6xl px-6 py-12 space-y-10">

      <div class="flex flex-col md:flex-row md:items-start justify-between gap-8">

        <!-- Projekt info -->
        <div class="space-y-3 max-w-sm">
          <p class="font-display text-xl italic text-marquee font-bold">Filmbarátok Info</p>
          <p class="font-body text-sm text-fog leading-relaxed">
            Kibeszélt filmek, sorozatok és adások kereshető rajongói archívuma.
          </p>
          <p class="text-xs text-fog/70">
            Ez egy független rajongói hobbi projekt. Nem áll hivatalos kapcsolatban a Filmbarátok Podcast készítőivel.
          </p>
        </div>

        <!-- Linkek és platformok -->
        <div class="flex flex-wrap gap-10">
          <!-- Navigációs linkek -->
          <div class="space-y-3">
            <p class="font-body text-xs font-bold uppercase tracking-widest text-paper">Oldalak</p>
            <ul class="space-y-2 text-sm text-fog">
              <li>
                <NuxtLink to="/" class="hover:text-marquee transition-colors">Főoldal</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/media" class="hover:text-marquee transition-colors">Összes film és sorozat</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/rolunk" class="hover:text-marquee transition-colors">Az oldalról</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Platforms -->
          <div class="space-y-3">
            <p class="font-body text-xs font-bold uppercase tracking-widest text-paper">Filmbarátok Platformok</p>
            <div class="flex flex-col space-y-2 text-sm text-fog">
              <a
                  v-for="platform in platforms"
                  :key="platform.title"
                  :href="platform.link"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center gap-2 hover:text-paper transition-colors"
              >
                <UIcon :name="platform.icon" class="size-4"/>
                <span>{{ platform.title }}</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      <!-- TMDB -->
      <div
          class="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-fog/70">
        <div class="flex items-center gap-3">
          <img src="/tmdb.svg" alt="TMDB Logo" class="size-24 shrink-0"/>
          <p class="text-[11px] leading-tight max-w-md">
            Movie and TV Show data is provided by TMDB API.
          </p>
        </div>

        <!-- Copyright -->
        <div class="text-center sm:text-right text-[11px]">
          {{ new Date().getFullYear() }} Filmbarátok Info - Hobbi Projekt
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
const platforms: { icon: string, title: string, link: string }[] = [
  {icon: 'i-simple-icons-youtube', title: 'YouTube', link: 'https://www.youtube.com/@filmbaratokpodcast'},
  {icon: 'i-simple-icons-spotify', title: 'Spotify', link: 'https://open.spotify.com/show/6yJdzElUC2xXgoXancHNTL'},
  {
    icon: 'i-simple-icons-applepodcasts',
    title: 'iTunes',
    link: 'https://podcasts.apple.com/hu/podcast/filmbar%C3%A1tok-podcast/id1165929483'
  },
  {
    icon: 'i-simple-icons-soundcloud',
    title: 'SoundCloud',
    link: 'https://soundcloud.com/filmbaratokpodcast'
  },
  {
    icon: 'i-simple-icons-wordpress',
    title: 'Hivatalos kereső',
    link: 'https://filmbaratok.blog.hu/'
  }
]
</script>