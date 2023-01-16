<template>
    <ContentWrapper>
        <p class="text-G500">{{ formatActivityDate(question.createdAt) }}</p>
    </ContentWrapper>
</template>

<script setup>
import formatActivityDate from "@/utils/formatActivityDate";
import { defineProps, toRefs } from "vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
