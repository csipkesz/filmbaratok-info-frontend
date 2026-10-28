<template>
  <div class="mx-auto max-w-6xl space-y-16 px-4 pt-12 pb-16 sm:px-6">

    <!-- HERO: title, short intro and the numbers as stickers -->
    <div class="grid items-start gap-10 md:grid-cols-[3fr_2fr]">
      <div class="space-y-4">
        <h1 class="font-poster text-6xl uppercase leading-none sm:text-7xl">
          Filmbarátok <span class="text-highlight">Téka</span>
        </h1>
        <p class="text-xl text-stone-200">
          A Filmbarátok Podcast és mellékműsorai (Expressz, Audiokommentár) több mint tíz éve foglalkoznak filmekkel
          és sorozatokkal. Az elhangzott témák a hivatalos blogon is visszakereshetők, ez az oldal pedig egy
          vizuálisabb, poszterekre épülő keresőt kínál hozzájuk: egy kattintással a videó annál a pontnál indul, ahol
          a film szóba kerül.
        </p>
        <p class="text-stone-400">
          A projekt egyúttal kísérlet is: mennyire pontosan lehet a YouTube-videók címeiből és leírásaiból
          automatikusan kereshető adatbázist építeni?
        </p>
      </div>

      <div class="flex flex-wrap gap-4 pt-4">
        <span
            v-for="(stat, index) in stats"
            :key="stat.label"
            class="bg-primary px-3 py-2 text-black shadow-[3px_3px_0_0_#000]"
            :class="index % 2 ? 'rotate-2' : '-rotate-2'"
        >
          <span class="block font-poster text-3xl leading-none">{{ stat.value }}</span>
          <span class="text-sm font-semibold">{{ stat.label }}</span>
        </span>
      </div>
    </div>

    <!-- STEPS: from the YouTube data to the static JSON files, each on a shelf board -->
    <section>
      <h2 class="mb-6 font-poster text-3xl uppercase">Hogyan működik?</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(step, index) in steps" :key="step.title">
          <div class="flex items-end gap-3">
            <span class="font-poster text-5xl leading-none text-primary">{{ index + 1 }}</span>
            <h3 class="font-poster text-xl uppercase leading-tight">{{ step.title }}</h3>
          </div>
          <div class="mt-2 h-3 border-b-4 border-black/40 bg-shelf"/>
          <p class="mt-3 text-sm text-stone-400">{{ step.text }}</p>
        </div>
      </div>
    </section>

    <div class="grid gap-10 md:grid-cols-2">
      <section class="space-y-2">
        <h2 class="font-poster text-2xl uppercase text-primary">Mennyire pontos?</h2>
        <p class="text-stone-300">
          Ahol a videó címe és leírása következetesen tartalmazza az adatokat, ott a feldolgozás automatikusan
          működik. Így a nagyjából 2200 téma 90%-a elsőre helyesen kerül be, a fennmaradó 100–200 hibás vagy
          hiányos tétel kézi javítása folyamatban van.
        </p>
        <p class="text-stone-300">
          A spoilerjelzés a videók leírásából származik. Nagyrészt pontos, de aki biztosan el akarja kerülni a
          spoilereket, annak érdemes az eredeti leírást is átfutnia.
        </p>
      </section>

      <section class="space-y-2">
        <h2 class="font-poster text-2xl uppercase text-primary">Napi válogatás</h2>
        <p class="text-stone-300">
          A főoldal minden nap új válogatást mutat: filmeket a polcon, a nap filmjét, a nap adását és egy
          audiokommentárt. A sorsolás a dátumon alapul, így egy adott napon mindenki ugyanazt látja.
        </p>
      </section>

      <section class="space-y-2">
        <h2 class="font-poster text-2xl uppercase text-primary">Az AI szerepe</h2>
        <p class="text-stone-300">
          Az adatok feldolgozásában nem vesz részt AI, a motor teljesen szabályalapú. A szabályok – főleg a
          bonyolultabb reguláris kifejezések – kidolgozásában viszont segített.
        </p>
        <p class="text-stone-300">
          A weboldal szerkezete és dizájnja AI segítségével készült, a kódot és az alkalmazás logikáját azonban
          ember nézte át és ellenőrizte. Az ismétlődő kódrészletek és a TODO-k az emberi lustaság
          következményei.
        </p>
      </section>

      <section class="space-y-2">
        <h2 class="font-poster text-2xl uppercase text-primary">Nyílt forráskód</h2>
        <p class="text-stone-300">
          A projekt két részből áll: a Nuxt 4-re épülő weboldalból, valamint egy NestJS-feldolgozóból, amely a YouTube-
          és a TMDB-adatokat előkészíti. Mindkettő elérhető a GitHubon.
        </p>
      </section>
    </div>

    <!-- CREDITS: like the small print on the back of a VHS case -->
    <section class="border-4 border-black bg-black/40 p-6 text-center">
      <h2 class="font-poster text-lg uppercase tracking-widest text-stone-400">Közreműködők</h2>
      <dl class="mt-3 grid gap-2 sm:grid-cols-3">
        <div v-for="credit in credits" :key="credit.role">
          <dt class="text-xs uppercase tracking-widest text-stone-500">{{ credit.role }}</dt>
          <dd class="font-poster text-xl uppercase">{{ credit.name }}</dd>
        </div>
      </dl>
      <div class="mt-5 flex flex-wrap justify-center gap-3">
        <UButton
            v-for="repo in repos"
            :key="repo.url"
            :to="repo.url"
            target="_blank"
            icon="i-simple-icons-github"
            :label="repo.label"
        />
      </div>
      <p class="mx-auto mt-5 max-w-xl text-sm text-stone-500">
        Ez egy független rajongói hobbiprojekt, amely nem áll hivatalos kapcsolatban a Filmbarátok Podcast
        készítőivel. A fejlesztés és a karbantartás szabadidőben folyik. A film- és sorozatadatok, valamint a képek
        a TMDB-től származnak.
      </p>
    </section>

  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Az oldalról · Filmbarátok Téka',
  meta: [
    {
      name: 'description',
      content: 'Hogyan készül a Filmbarátok Téka: a YouTube-adatok feldolgozása, a TMDB-párosítás és a pontosság.'
    }
  ]
})

const stats = [
  {value: '~2200', label: 'feldolgozott téma'},
  {value: '~90%', label: 'automatikusan helyes'},
  {value: '100–200', label: 'kézi javításra vár'},
  {value: '10+ év', label: 'adástörténet'},
]

const steps = [
  {
    title: 'YouTube-adatok',
    text: 'A feldolgozó a YouTube API-n keresztül lekéri a Filmbarátok-csatorna összes videójának címét, leírását és megjelenési dátumát.',
  },
  {
    title: 'Témák kinyerése',
    text: 'A leírások évek óta egységes formátumot követnek (köszönet érte a srácoknak), így saját szabályokkal kinyerhetők belőlük a kibeszélt témák, az időbélyegek és a résztvevők.',
  },
  {
    title: 'TMDB-párosítás',
    text: 'A feldolgozó a kinyert címeket a TMDB-filmadatbázis tételeivel párosítja, innen származnak a poszterek, a háttérképek és az eredeti címek.',
  },
  {
    title: 'Statikus JSON',
    text: 'A feldolgozott adatok statikus JSON-fájlokba kerülnek, így nincs szükség külön adatbázisra vagy szerverre, és az oldal gyorsan betöltődik.',
  },
]

const credits = [
  {role: 'Készítette', name: 'csipkesz'},
  {role: 'Adatok', name: 'YouTube és TMDB'},
  {role: 'Műsor', name: 'Filmbarátok Podcast'},
]

const repos = [
  {label: 'Weboldal', url: 'https://github.com/csipkesz/filmbaratok-info-frontend'},
  {label: 'Adatfeldolgozó', url: 'https://github.com/csipkesz/youtube-info-export'},
]
</script>
