<template>
  <span class="absolute z-10 flex flex-wrap gap-1" :class="size === 'md' ? '-left-2 -top-2 -rotate-6' : '-left-1 -top-1'">
    <span
        v-if="isSpoiler"
        class="bg-spoiler font-poster text-xs uppercase text-white"
        :class="stickerPadding"
    >
      Spoiler
    </span>
    <template v-else>
      <span
          v-for="category in uniqueCategories"
          :key="category"
          class="bg-primary font-poster text-xs uppercase text-black"
          :class="stickerPadding"
      >
        {{ formatCategory(category) }}
      </span>
    </template>
  </span>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import type {MediaIndexItem} from '~/models/indexes/media-index-item.ts'
import {formatCategory} from "~/utils/format-category.ts";

const props = defineProps({
  media: {
    type: Object as PropType<MediaIndexItem>,
    required: true,
  },
  size: {
    type: String as PropType<'sm' | 'md'>,
    default: 'md',
  },
})

const stickerPadding = computed(() => props.size === 'md' ? 'px-2 py-1' : 'px-1.5 py-0.5')

const isSpoiler = computed(() => {
  if (!props.media.contents || props.media.contents.length === 0) {
    return false
  }

  return props.media.contents.some(c => c.isSpoiler)
})

const uniqueCategories = computed(() => {
  if (!props.media.contents) {
    return []
  }

  const categories = props.media.contents.map(c => c.category)
  return Array.from(new Set(categories))
})
</script>
