<template>
    <div class="text-right">
        <Tag variant="date">{{ formatDate(date.getTime() / 1000) }}</Tag>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Tag } from "@resorptionbidonvilles/ui";
import formatDate from "@/utils/formatDate";

const props = defineProps({
    date: {
        type: Date,
    },
});
const { date } = toRefs(props);
</script>
