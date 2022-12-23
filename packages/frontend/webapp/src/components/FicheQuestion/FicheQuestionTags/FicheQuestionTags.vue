<template>
    <Tag variant="primary" v-for="tag in question.tags" :key="tag">
        {{ tag }}
    </Tag>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
