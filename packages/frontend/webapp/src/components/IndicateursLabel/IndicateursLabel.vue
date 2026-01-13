<template>
    <span class="leading-4" :class="{ 'font-bold': bold }" v-bind="$attrs">
        <slot />
    </span>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
    bold: {
        type: Boolean,
        default: true,
    },
});
</script>
