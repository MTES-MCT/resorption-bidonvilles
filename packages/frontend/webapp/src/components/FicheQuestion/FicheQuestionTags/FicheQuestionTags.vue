<template>
    <ContentWrapper>
        <Tag variant="primary" v-for="tag in question.tags" :key="tag">
            {{ tag }}
        </Tag>
    </ContentWrapper>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Tag } from "@resorptionbidonvilles/ui";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
