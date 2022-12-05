<template>
    <p class="flex items-center uppercase text-sm space-x-2">
        <span
            class="inline-block rounded-full h-3 w-3"
            :class="isClosed ? 'bg-corail' : 'bg-green'"
        />

        <span>
            <template v-if="isClosed">
                Fermée le {{ formatDate(plan.closed_at / 1000, "d/m/y") }}
            </template>

            <template v-else-if="plan.updated_at">
                Mise à jour le {{ formatDate(plan.updated_at / 1000, "d/m/y") }}
            </template>

            <template v-else>
                Déclarée le {{ formatDate(plan.created_at / 1000, "d/m/y") }}
            </template>
        </span>
    </p>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import formatDate from "@/utils/formatDate";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

const isClosed = computed(() => {
    return plan.value.closed_at;
});
</script>
