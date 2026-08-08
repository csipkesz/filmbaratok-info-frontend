<template>
  <div class="bg-ink min-h-screen text-paper py-12">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">

      <!-- HERO FEJLÉC -->
      <div class="text-center space-y-4">
        <div class="flex flex-wrap items-center justify-center gap-2">
          <UBadge color="warning" variant="subtle" size="md" class="font-mono">
            Hobbi Projekt
          </UBadge>
          <UBadge color="neutral" variant="subtle" size="md" class="font-mono">
            90%+ Pontosság
          </UBadge>
          <UBadge color="success" variant="subtle" size="md" class="font-mono">
            Open Source
          </UBadge>
        </div>

        <h1 class="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-paper leading-tight">
          A Filmbarátok Info működése
        </h1>
        <!--        <p class="font-body text-base sm:text-lg text-fog max-w-3xl mx-auto leading-relaxed">-->
        <!--        </p>-->
      </div>

      <UCard variant="outline" class="bg-ink-soft/80 border-white/10 shadow-xl">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-marquee/10 text-marquee border border-marquee/20">
              <UIcon name="i-lucide-film" class="w-6 h-6"/>
            </div>
            <div>
              <h2 class="font-display text-2xl font-bold text-paper">Miről szól ez az oldal?</h2>
              <p class="text-xs text-fog">Az archívum célja és alapötlete</p>
            </div>
          </div>
        </template>

        <div class="space-y-4 text-sm text-fog leading-relaxed">
          <p>
            A <strong class="text-paper">Filmbarátok Podcast</strong> és a hozzá tartozó adások (Expressz,
            Audiokommentár) több mint egy évtizede szállítják a filmes kibeszélőket. Az adásokban elhangzó több ezer
            film és sorozat keresése azonban a YouTube felületén nehézkes volt, a blog.hu -s oldal pedig könnyen
            kereshető, de kevésbé vizuális.
          </p>
          <p>
            A projekt célja az volt, hogy a YouTube videók leírásából és címeiből kinyert adatokat egy filmadatbázissal
            (TMDB) összefésülve egy <strong class="text-paper">kb. 90%-os pontossággal kereshető, vizuális
            katalógust</strong> hozzak létre, ahol azonnal elérhető a pontos időbélyeg is.
          </p>
        </div>
      </UCard>

      <div class="space-y-6">
        <div class="text-center space-y-2">
          <h2 class="font-display text-3xl font-bold text-paper">Hogyan működik a gépezet?</h2>
          <p class="text-sm text-fog max-w-xl mx-auto">
            A YouTube adatok kinyerésétől a statikus JSON fájlokig , lépésről lépésre.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Step 1 -->
          <UCard variant="subtle" class="bg-ink-soft/60 border-white/10">
            <div class="flex items-start gap-4">
              <div
                  class="w-8 h-8 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                1
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-simple-icons-youtube" class="w-4 h-4 text-red-500"/>
                  <h3 class="font-display text-base font-bold text-paper">YouTube Adatlekérés</h3>
                </div>
                <p class="text-xs text-fog leading-relaxed">
                  A YouTube API végpontjainak segítségével lekértem a Filmbarátok csatorna összes megjelent videójának
                  metaadatait (címek, leírások, közzétételi dátumok).
                </p>
              </div>
            </div>
          </UCard>

          <!-- Step 2 -->
          <UCard variant="subtle" class="bg-ink-soft/60 border-white/10">
            <div class="flex items-start gap-4">
              <div
                  class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                2
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-code-2" class="w-4 h-4 text-amber-400"/>
                  <h3 class="font-display text-base font-bold text-paper">Regex & Adatbázis Építés</h3>
                </div>
                <p class="text-xs text-fog leading-relaxed">
                  Köszönet a srácoknak, hogy 10 éve konzisztens formátumot használnak! Egyedi parser szabályokkal
                  kinyertem az adásokból a kibeszélt témákat, időbélyegeket és a megjelölt résztvevőket.
                </p>
              </div>
            </div>
          </UCard>

          <!-- Step 3 -->
          <UCard variant="subtle" class="bg-ink-soft/60 border-white/10">
            <div class="flex items-start gap-4">
              <div
                  class="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                3
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-database" class="w-4 h-4 text-cyan-400"/>
                  <h3 class="font-display text-base font-bold text-paper">TMDB Film Párosítás</h3>
                </div>
                <p class="text-xs text-fog leading-relaxed">
                  A kinyert címeket összeillesztettem a TMDB filmadatbázissal (poszterek, háttérképek, eredeti címek).
                  Bár nem 100%-os a gépi egyezés, a találati arány rendkívül magas és idővel manuálisan kikupálható.
                </p>
              </div>
            </div>
          </UCard>

          <!-- Step 4 -->
          <UCard variant="subtle" class="bg-ink-soft/60 border-white/10">
            <div class="flex items-start gap-4">
              <div
                  class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                4
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-zap" class="w-4 h-4 text-emerald-400"/>
                  <h3 class="font-display text-base font-bold text-paper">Statikus JSON Export</h3>
                </div>
                <p class="text-xs text-fog leading-relaxed">
                  A feldolgozott adatokat statikus JSON fájlokba exportáltam. Így nincs szükség külön futó adatbázisra
                  vagy drága szerverre, a weboldal azonnal, villámgyorsan tölt be bárhol.
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- 3. STATISZTIKÁK & LEFEDETTSÉG -->
      <UCard variant="outline" class="bg-ink-soft/80 border-white/10">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <UIcon name="i-lucide-bar-chart-3" class="w-6 h-6"/>
            </div>
            <div>
              <h2 class="font-display text-2xl font-bold text-paper">Milyen a lefedettség?</h2>
              <p class="text-xs text-fog">Számok és felismerési arányok</p>
            </div>
          </div>
        </template>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
            <div class="font-mono text-2xl sm:text-3xl font-bold text-marquee">~2200+</div>
            <div class="text-[11px] text-fog font-medium mt-1">Érzékelt tartalom</div>
          </div>
          <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
            <div class="font-mono text-2xl sm:text-3xl font-bold text-emerald-400">~90%</div>
            <div class="text-[11px] text-fog font-medium mt-1">Automatikus pontosság</div>
          </div>
          <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
            <div class="font-mono text-2xl sm:text-3xl font-bold text-amber-400">100-200</div>
            <div class="text-[11px] text-fog font-medium mt-1">Manuális pontosításra vár</div>
          </div>
          <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
            <div class="font-mono text-2xl sm:text-3xl font-bold text-purple-400">10 év</div>
            <div class="text-[11px] text-fog font-medium mt-1">Feldolgozott adástörténet</div>
          </div>
        </div>

        <p class="text-xs text-fog leading-relaxed">
          Amennyiben a YouTube videók címében és leírásában konzisztensen szerepelnek az adatok, a rendszer
          automatikusan fel tudta azokat dolgozni. A manuális utómunka mértéke jelenleg elenyésző, de a problémásabb
          szituációkra és a 100-200 pontatlanabbul felismert elem finomítására elő lettek készítve a megfelelő
          megoldások.
        </p>
      </UCard>

      <!-- 4. AZ AI ÉS NYELVI MODELLEK SZEREPE -->
      <UCard variant="outline" class="bg-ink-soft/80 border-white/10">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <UIcon name="i-lucide-bot" class="w-6 h-6"/>
            </div>
            <div>
              <h2 class="font-display text-2xl font-bold text-paper">Az AI és Nyelvi Modellek szerepe</h2>
              <p class="text-xs text-fog">Transzparens információ az AI használatáról</p>
            </div>
          </div>
        </template>

        <div class="space-y-4 text-sm text-fog leading-relaxed">
          <div class="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-2">
            <div class="flex items-center gap-2 text-purple-300 font-semibold text-xs">
              <UIcon name="i-lucide-check-circle-2" class="w-4 h-4 text-purple-400"/>
              <span>Nem "vibe-coded" projekt, emberi kontroll és ellenőrzés</span>
            </div>
            <p class="text-xs text-fog">
              Az adatok feldolgozása során <strong>nem történt AI bevonása</strong>. Az adatkinyerést végző algoritmus
              kidolgozásában
              (pl. komplex reguláris kifejezések összeállításában) az AI segítséget nyújtott, de maga a motor teljesen
              algoritmus-alapú.
            </p>
          </div>

          <p class="text-xs">
            A weboldal alap felépítését és dizájn elemeit AI segítette generálni, viszont az alkalmazás üzleti
            logikája, állapotkezelése és belső kódstruktúrája szigorú emberi áttekintés és ellenőrzés mellett
            készült. (Az ismételt kód részletek és TODO jelölések az emberi lustaság következményei.)
          </p>
        </div>
      </UCard>

      <!-- 5. JELENLEGI FUNKCIÓK ÉS NAPI SORSOLÓ -->
      <UCard variant="outline" class="bg-ink-soft/80 border-white/10">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <UIcon name="i-lucide-sparkles" class="w-6 h-6"/>
            </div>
            <div>
              <h2 class="font-display text-2xl font-bold text-paper">Jelenlegi funkciók és képességek</h2>
              <p class="text-xs text-fog">Mit tud az alkalmazás jelenleg?</p>
            </div>
          </div>
        </template>

        <ul class="space-y-3 text-xs text-fog">
          <li class="flex items-start gap-2.5">
            <UIcon name="i-lucide-check" class="w-4 h-4 text-marquee shrink-0 mt-0.5"/>
            <span><strong class="text-paper">Determinisztikus napi sorsoló:</strong> A kezdőlapon a rendszer minden nap determinisztikusan sorsol ki napi filmeket, sorozatokat és kommentárokat.</span>
          </li>
          <li class="flex items-start gap-2.5">
            <UIcon name="i-lucide-check" class="w-4 h-4 text-marquee shrink-0 mt-0.5"/>
            <span><strong class="text-paper">Összetett kereső:</strong> Keresés film vagy sorozat címe, eredeti angol címe, YouTube videó címe vagy szereplők neve alapján (Fuse.js fuzzy search).</span>
          </li>
          <li class="flex items-start gap-2.5">
            <UIcon name="i-lucide-check" class="w-4 h-4 text-marquee shrink-0 mt-0.5"/>
            <span><strong class="text-paper">Spoiler jelzések:</strong> Jelezzük a kártyákon és részleteknél a spoileres kibeszélőket. Ezek nagy százalékban pontosak, de érdemes az eredeti videó leírást is átfutni.</span>
          </li>
        </ul>
      </UCard>

      <UCard variant="outline" class="bg-ink-soft/80 border-white/10">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UIcon name="i-simple-icons-github" class="w-6 h-6"/>
            </div>
            <div>
              <h2 class="font-display text-2xl font-bold text-paper">Nyílt Forráskód (Open Source)</h2>
              <p class="text-xs text-fog">Nézd meg a kódkészletet a GitHub-on!</p>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-xs text-fog leading-relaxed">
            A projekt két különálló repository-ból áll: a webes felületért felelős frontendből, valamint az adatokat
            előkészítő backend/parser eszközből.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <!-- Frontend Repo Card -->
            <div class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center gap-2 text-paper font-bold text-sm">
                  <UIcon name="i-lucide-layout" class="w-4 h-4 text-marquee"/>
                  <span>Frontend Repository</span>
                </div>
                <p class="text-xs text-fog mt-1">
                  Nuxt 4, Vue 3, Nuxt UI & TailwindCSS v4 alapú webes felület.
                </p>
              </div>
              <UButton
                  to="https://github.com/csipkesz/filmbaratok-info-frontend"
                  target="_blank"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                  icon="i-simple-icons-github"
                  block
              >
                Frontend kód megtekintése
              </UButton>
            </div>

            <!-- Backend Repo Card -->
            <div class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center gap-2 text-paper font-bold text-sm">
                  <UIcon name="i-lucide-server" class="w-4 h-4 text-cyan-400"/>
                  <span>Backend / Preprocessor</span>
                </div>
                <p class="text-xs text-fog mt-1">
                  YouTube adatok kinyerését és TMDB integrációt végző feldolgozó. (Nest.js)
                </p>
              </div>
              <UButton
                  to="https://github.com/csipkesz"
                  target="_blank"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                  icon="i-simple-icons-github"
                  block
              >
                Backend kód megtekintése
              </UButton>
            </div>
          </div>
        </div>
      </UCard>

      <!-- 7. HOBBI PROJEKT & JOGI NYILATKOZAT -->
      <UCard variant="subtle" class="bg-ink-soft/40 border-white/10">
        <div class="space-y-4 text-xs text-fog leading-relaxed">
          <div class="flex items-center gap-2 text-paper font-bold text-sm">
            <UIcon name="i-lucide-heart" class="w-4 h-4 text-rose-500"/>
            <span>Hobbi Projekt Nyilatkozat</span>
          </div>

          <p>
            Ez a weboldal egy egyéni hobbi projekt, amelyet saját szórakoztatásomra és kikapcsolódásként készítettem. Az
            elkészítés előtt nem egyeztettem a Filmbarátok szereplőivel, de amennyiben az időm engedi, örömmel
            fejlesztés alatt tartom és karbantartom a jövőben is.
          </p>

          <div
              class="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-info" class="w-3.5 h-3.5 text-fog/60"/>
              <span>Film adatok és poszterek: TMDB API</span>
            </span>
            <NuxtLink to="/" class="text-marquee hover:underline font-semibold">
              Vissza a főoldalra
            </NuxtLink>
          </div>
        </div>
      </UCard>

    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Rólunk és Hogyan működik? - Filmbarátok Info',
  meta: [
    {
      name: 'description',
      content: 'Tudd meg, hogyan épül fel a Filmbarátok Info rajongói archívum, hogyan működik a YouTube és TMDB adatfeldolgozási folyamat.'
    }
  ]
})
</script>
