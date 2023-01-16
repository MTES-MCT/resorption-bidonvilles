<template>
    <ContentWrapper>
        <h1 class="text-3xl text-primary">{{ question.question }}</h1>
    </ContentWrapper>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
