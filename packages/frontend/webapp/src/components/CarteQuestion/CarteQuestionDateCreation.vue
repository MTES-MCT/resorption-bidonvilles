<template>
    <div class="flex justify-start text-G600">
        {{ formatDate(question.createdAt, "d M y à h:i") }}
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
