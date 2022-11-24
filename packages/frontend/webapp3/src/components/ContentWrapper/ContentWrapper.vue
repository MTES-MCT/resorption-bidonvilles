<template>
    <div :class="`mx-auto px-4 lg:px-6 ${sizeClass}`">
        <slot />
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";

const props = defineProps({
    size: {
        type: String,
        required: false,
        default: "extralarge",
    },
});
const sizes = {
    extralarge: "max-w-screen-2xl",
    large: "max-w-screen-xl",
    intermediate: "max-w-5xl",
    medium: "max-w-2xl",
    small: "max-w-md",
};

const { size } = toRefs(props);
const sizeClass = computed(() => {
    return sizes[size.value] || sizes.large;
});
</script>
