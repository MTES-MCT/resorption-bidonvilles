<template>
    <div
        class="mb-6 bg-red200 px-4 py-3 relative"
    >
        <span class="absolute -left-4 bg-error w-1 h-full top-0"></span>
        <span class="font-bold">{{ message }}</span>
        <ul
            v-if="summaryErrors.length > 0"
            class="mt-2 pl-5 list-disc"
        >
            <li v-for="error in summaryErrors" :key="error.key">
                <a :href="`#${error.key}`">{{ error.message }}</a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    summary: {
        type: Object,
        required: false,
        default: () => ({})
    }
});

const { message, summary } = toRefs(props);
const summaryErrors = computed(() => {
    return Object.keys(summary.value).map((key) => ({
        key,
        message: summary.value[key]
    }));
});
</script>