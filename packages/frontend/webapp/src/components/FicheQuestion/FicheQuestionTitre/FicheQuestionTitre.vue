<template>
    <h1 class="text-primary text-xl">{{ question.question }}</h1>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
