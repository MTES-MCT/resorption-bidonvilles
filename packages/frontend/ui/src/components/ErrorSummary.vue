<template>
    <div class="mb-6 bg-red200 px-4 py-3 relative" role="alert">
        <span class="absolute -left-4 bg-error w-1 h-full top-0"></span>
        <span class="font-bold">{{ message }}</span>
        <ul v-if="summaryErrors.length > 0" class="mt-2 pl-5 list-disc">
            <li v-for="error in summaryErrors" :key="error.key">
                <Link :to="`#${error.key}`">{{ error.message }}</Link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import Link from "./Link.vue";

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
    if (!summary.value) {
        return [];
    }
    return Object.keys(summary.value).map((key) => ({
        key,
        message: summary.value[key]
    }));
});
</script>