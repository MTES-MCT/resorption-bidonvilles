<template>{{ content }}</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    content: {
        type: [String, Number],
        required: true,
    },
});
const { content } = toRefs(props);
</script>
