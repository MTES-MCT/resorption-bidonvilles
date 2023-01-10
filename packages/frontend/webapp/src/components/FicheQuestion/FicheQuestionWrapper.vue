<template>
    <div
        class="border-solid border-1 border-gray-200 mx-auto p-4 lg:px-16 max-w-screen-2xl"
    >
        <h1 class="text-3xl text-primary">{{ question.question }}</h1>
        <h2
            class="mb-4 text-sm font-bold"
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

        <slot />
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
