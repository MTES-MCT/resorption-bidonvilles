<template>
    <p class="text-G700">{{ formatActivityDate(question.createdAt) }}</p>
</template>

<script setup>
import formatActivityDate from "@/utils/formatActivityDate";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
