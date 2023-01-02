<template>
    <h1 class="text-primary text-xl">{{ question.question }}</h1>
    <h2
        class="mb-4"
        v-if="question.peopleAffected && question.peopleAffected > 0"
    >
        {{ question.peopleAffected }}
        {{
            question.peopleAffected > 1
                ? "habitants concernés"
                : "habitant concerné"
        }}
        par cette question
    </h2>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
