<template>
    <div class="flex flex-col xs:flex-row gap-2">
        <QuestionTag v-for="tag in question.tags" :key="tag.uid" :tag="tag" />
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import QuestionTag from "@/components/QuestionTag/QuestionTag.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
