<template>
    <div>
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
