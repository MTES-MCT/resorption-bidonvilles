<template>
    <div class="mb-6 bg-red200 text-error px-2 py-3 relative" role="alert">
        <span class="absolute -left-4 bg-error w-0.5 h-full top-0"></span>
        <div class="flex flex-row gap-1" v-if="message">
        <span class="fr-icon-error-fill fr-icon--sm" aria-hidden="true"></span>
        <span class="font-normal">{{ message }}</span>
        </div>
        <ul v-if="summaryErrors.length > 0" class="mt-2 pl-5 list-disc">
            <li v-for="error in summaryErrors" :key="error.key" class="list-none flex flex-row gap-1">
                <span class="fr-icon-error-fill fr-icon--xs" aria-hidden="true"></span>
                <Link :to="`#${error.key}`" color="text-error">{{ error.message }}</Link>
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
        required: true,
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