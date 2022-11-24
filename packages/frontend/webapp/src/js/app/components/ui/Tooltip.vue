<template>
  <div @mouseenter="hovered = true" @mouseleave="hovered = false">
    <div
      class="mt-10 ml-5 bg-yellow-200 shadow-md text-black py-4 px-6"
      :class="hovered ? 'absolute z-50' : 'hidden'"
    >
      {{ text }}
    </div>
    <slot />
  </div>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";

const props = defineProps({
  tip: String
});
const { text } = toRefs(props);
const hovered = ref(false);
</script>
