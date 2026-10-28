<template>
  <!-- A real link when it points to YouTube, so middle click and "copy link" work -->
  <component
      :is="href ? 'a' : 'button'"
      :href="href ?? undefined"
      :target="href ? '_blank' : undefined"
      :rel="href ? 'noopener noreferrer' : undefined"
      class="group relative isolate flex min-h-96 flex-col justify-end overflow-hidden border-4 border-black p-6 text-left cursor-pointer"
  >
    <img
        v-if="image"
        :src="image"
        alt=""
        class="absolute inset-0 -z-10 h-full w-full object-cover opacity-50 transition-transform duration-500"
        :class="letterboxed ? 'scale-[1.34] group-hover:scale-[1.4]' : 'group-hover:scale-105'"
    />
    <span class="absolute inset-0 -z-10 bg-gradient-to-t from-teka via-teka/70 to-transparent"/>
    <slot/>
  </component>
</template>

<script setup lang="ts">
defineProps({
  image: {
    type: String as PropType<string | null>,
    default: null,
  },
  href: {
    type: String as PropType<string | null>,
    default: null,
  },
  // 4:3 YouTube thumbnails have black bars above and below the 16:9 frame, zooming in pushes them out of the card
  letterboxed: {
    type: Boolean,
    default: false,
  },
})
</script>
