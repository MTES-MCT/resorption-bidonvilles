<template>
    <article class="flex flex-col py-4 bg-blue200 items-center justify-center">
        <p class="text-3xl font-bold">{{ value }}</p>
        <p>{{ label }}</p>
        <p class="text-xs">{{ info }}</p>
    </article>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    label: {
        type: String,
    },
    info: {
        type: String,
    },
    value: {
        type: [String, Number],
    },
});

const { label, info, value } = toRefs(props);
</script>
