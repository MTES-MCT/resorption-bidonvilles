<template>
    <article class="p-4 flex space-x-2 border">
        <div class="flex-1">
            <h3 class="font-bold">
                {{ phase.preparatoryPhaseName }}
            </h3>
            <p v-if="phase.completedAt !== null">
                {{ phase.preparatoryPhaseDateLabel }}:
                {{ formatDate(phase.completedAt) }}
            </p>
        </div>
    </article>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import formatDate from "@common/utils/formatDate.js";

const props = defineProps({
    phase: Object,
});
const { phase } = toRefs(props);
</script>
