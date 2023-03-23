<template>
    <p class="text-primary text-xl font-bold pt-4 pb-2 break-words">
        {{ question }}
    </p>
</template>

<script setup>
import { toRefs } from "vue";
const props = defineProps({
    question: {
        type: String,
        required: true,
    },
});
const { question } = toRefs(props);
</script>
