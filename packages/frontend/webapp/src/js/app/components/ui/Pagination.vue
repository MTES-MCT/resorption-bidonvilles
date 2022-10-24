<template>
  <div class="flex flex-row items-center">
    <Button
      icon="chevron-left"
      iconPosition="left"
      variant="custom"
      size="custom"
      class="hover:bg-G200 rounded-full px-4 py-1 mx-2 focus:outline-none"
      :disabled="currentPage === 1"
      @click="onPrevious"
      type="button"
      >Précédent</Button
    >

    <div
      class="h-8 w-8 hover:bg-G200 flex justify-center items-center rounded-full cursor-pointer"
      @click="$emit('pagechange', 1)"
    >
      <span v-if="currentPage > 1">1</span>
    </div>
    <div
      :class="[
        'h-8 w-8 bg-primary text-white flex justify-center items-center rounded-full',
        currentPage === 1 ? '' : 'ml-4',
        currentPage === nbPages ? '' : 'mr-4'
      ]"
    >
      {{ currentPage }}
    </div>
    <div
      v-if="currentPage !== nbPages"
      @click="$emit('pagechange', nbPages)"
      class="h-8 w-8 hover:bg-G200 flex justify-center items-center rounded-full cursor-pointer"
    >
      {{ nbPages }}
    </div>

    <Button
      icon="chevron-right"
      iconPosition="right"
      variant="custom"
      size="custom"
      :disabled="currentPage === nbPages"
      class="hover:bg-G200 rounded-full px-4 py-1 mx-2 focus:outline-none"
      @click="onNext"
      type="button"
      >Suivant</Button
    >
  </div>
</template>

<script setup>
import { defineProps, toRefs, defineEmits } from "vue";
import Button from "./Button.vue";

const props = defineProps({
  currentPage: {
    type: Number
  },
  nbPages: {
    type: Number
  }
});
const emit = defineEmits(["pagechange"]);
const { currentPage, nbPages } = toRefs(props);

function onPrevious() {
  emit("pagechange", Math.max(1, currentPage.value - 1));
}

function onNext() {
  emit("pagechange", Math.min(currentPage.value + 1, nbPages.value));
}
</script>
