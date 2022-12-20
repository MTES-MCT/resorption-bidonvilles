<template>
    <div class="text-md pt-4 pb-2">
        <div class="text-primary text-display-md font-bold">
            <span class="font-bold">
                {{ question }}
            </span>
        </div>
    </div>
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
