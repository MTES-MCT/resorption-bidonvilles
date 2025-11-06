<template>
    <div
        :aria-label="`Question créée le ${formatTimestamp(
            question.createdAt,
            'd M y'
        )} à ${formatTimestamp(
            question.createdAt,
            'h'
        )} heure ${formatTimestamp(question.createdAt, 'i')}`"
        class="flex justify-start text-G700"
    >
        Le {{ formatTimestamp(question.createdAt, "d M y à h:i") }}
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import formatTimestamp from "@common/utils/formatTimestamp.js";

const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});
const { question } = toRefs(props);
</script>
