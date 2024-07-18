<template>
    <div @mouseenter="hovered = true" @mouseleave="hovered = false" class="inline-block">
        <div class="mt-10 text-pretty"
        :class="[hovered ? 'absolute z-50' : 'hidden', tooltipSide, extraSize, extraStyle]">
            {{ tip }}
        </div>
        <slot />
    </div>
</template>
  
<script setup>
import { defineProps, toRefs, ref, computed } from "vue";

const props = defineProps({
    tip: String,
    side: {
        type: String,
        default: "left",
        required: false,
    },
    extraStyle: {
        type: String,
        default: "ml-5 bg-yellow-200 shadow-md text-black py-4 px-6",
        required: false,
    },
});
const { tip, side } = toRefs(props);
const hovered = ref(false);

const tooltipSide = computed(() => {
    return side.value === "right" ? "right-0" : "left-0";
});

const extraSize = computed(() => {
    return tip.value.length > 10 ? "max-w-60 min-w-40 w-full" : "";
});
</script>
  