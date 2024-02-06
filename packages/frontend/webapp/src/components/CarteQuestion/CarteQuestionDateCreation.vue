<template>
    <div
        tabindex="0"
        :aria-label="`Question créée le ${formatDate(
            question.createdAt,
            'd M y'
        )} à ${formatDate(question.createdAt, 'h')} heure ${formatDate(
            question.createdAt,
            'i'
        )}`"
        class="flex justify-start text-G700"
    >
        Le {{ formatDate(question.createdAt, "d M y à h:i") }}
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import formatDate from "@common/utils/formatDate.js";

const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});
const { question } = toRefs(props);
</script>
