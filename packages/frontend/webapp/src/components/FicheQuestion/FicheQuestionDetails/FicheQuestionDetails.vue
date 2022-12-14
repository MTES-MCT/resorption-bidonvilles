<template>
    <p>{{ question.details }}</p>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
