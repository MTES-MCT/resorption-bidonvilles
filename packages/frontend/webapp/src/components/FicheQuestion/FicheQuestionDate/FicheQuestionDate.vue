<template>
    <p class="text-G500">{{ formatActivityDate(question.createdAt) }}</p>
</template>

<script setup>
import formatActivityDate from "@/utils/formatActivityDate";
import { toRefs } from "vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
