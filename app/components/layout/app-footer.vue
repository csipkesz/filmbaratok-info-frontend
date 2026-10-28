<template>
  <footer class="border-t-4 border-shelf">
    <div class="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">

      <div class="flex flex-col justify-between gap-8 md:flex-row md:items-start">

        <!-- Project info -->
        <div class="max-w-sm space-y-3">
          <AppLogo/>
          <p class="text-stone-300">
            Kibeszélt filmek, sorozatok és adások kereshető rajongói archívuma.
          </p>
          <p class="text-sm text-stone-500">
            Ez egy független rajongói hobbi projekt. Nem áll hivatalos kapcsolatban a Filmbarátok Podcast készítőivel.
          </p>
        </div>

        <!-- Links and platforms -->
        <div class="flex flex-wrap gap-12">
          <!-- Navigation links -->
          <div class="space-y-3">
            <p class="font-poster uppercase tracking-wider text-primary">Oldalak</p>
            <ul class="space-y-2 text-stone-300">
              <li>
                <ULink to="/" class="text-stone-300 hover:text-primary">Főoldal</ULink>
              </li>
              <li>
                <ULink to="/media" class="text-stone-300 hover:text-primary">Összes film és sorozat</ULink>
              </li>
              <li>
                <ULink to="/rolunk" class="text-stone-300 hover:text-primary">Az oldalról</ULink>
              </li>
            </ul>
          </div>

          <!-- Platforms -->
          <div class="space-y-3">
            <p class="font-poster uppercase tracking-wider text-primary">Filmbarátok platformok</p>
            <div class="flex flex-col space-y-2">
              <ULink
                  v-for="platform in platforms"
                  :key="platform.title"
                  :to="platform.link"
                  target="_blank"
                  class="flex items-center gap-2 text-stone-300 hover:text-primary"
              >
                <UIcon :name="platform.icon" class="size-4"/>
                <span>{{ platform.title }}</span>
              </ULink>
            </div>
          </div>
        </div>

      </div>

      <!-- TMDB -->
      <div class="flex flex-col items-center justify-between gap-6 border-t border-stone-800 pt-8 text-xs text-stone-500 sm:flex-row">
        <div class="flex items-center gap-3">
          <img src="/tmdb.svg" alt="TMDB Logo" class="size-24 shrink-0"/>
          <p class="max-w-md leading-tight">
            Movie and TV Show data is provided by TMDB API.
          </p>
        </div>

        <div class="space-y-1 text-center sm:text-right">
          <p v-if="lastUpdatedAt">Utolsó frissítés: {{ lastUpdatedAt }}</p>
          <p>
            {{ new Date().getFullYear() }} Filmbarátok Info - Hobbi Projekt by
            <ULink to="https://github.com/csipkesz" target="_blank" class="text-stone-400 hover:text-primary">csipkesz</ULink>
          </p>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
import AppLogo from "~/components/layout/app-logo.vue";

const jsonRepo = useJsonRepo()
const lastUpdatedAt = ref<string | null>(null)

onMounted(async () => {
  const meta = await jsonRepo.fetchMeta()
  if (!meta?.lastUpdatedAt) {
    return
  }

  lastUpdatedAt.value = new Date(meta.lastUpdatedAt).toLocaleString('hu-HU', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
})

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