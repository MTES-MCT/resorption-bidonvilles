<template>
    <p class="text-right">
        <Tag variant="date">{{ formatHistoryDate(date.getTime() / 1000) }}</Tag>
    </p>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import formatHistoryDate from "@/utils/formatHistoryDate";

import { Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    date: {
        type: Date,
    },
});
const { date } = toRefs(props);
</script>
