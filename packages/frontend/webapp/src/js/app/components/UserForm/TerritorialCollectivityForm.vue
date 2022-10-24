<template>
  <div class="relative">
    <TextInput prefixIcon="magnifying-glass" v-bind="$attrs" @input="onInput" />

    <div
      class="absolute w-full z-10 border-1 border-G300 bg-white mt-1"
      v-if="results.length > 0"
    >
      <div class="flex" v-for="section in results" :key="section.title">
        <div
          class="w-32 px-3 py-2 text-right text-sm text-G600 border-r border-G200 border-b"
        >
          {{ section.title }}
        </div>
        <div class="border-b border-G200 flex-1">
          <div
            class="hover:bg-blue100 cursor-pointer px-3 py-2"
            v-for="item in section.items"
            :key="item.id"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import TextInput from "./TextInput.vue";

const props = defineProps({
  fn: Function
});
const { fn } = toRefs(props);

const rawResults = ref([]);
async function onInput({ target }) {
  const { value } = target;
  if (value.length < 2) {
    return;
  }

  try {
    rawResults.value = await fn.value(value);
  } catch (error) {
    console.log(error);
  }
}

const results = computed(() => {
  const categories = {};
  return rawResults.reduce((acc, item) => {
    const { category } = item;

    if (!categories[category]) {
      categories[category] = {
        title: category,
        items: []
      };
      acc.push(categories[category]);
    }

    categories[category].items.push(item);
    return acc;
  }, []);
});
</script>
