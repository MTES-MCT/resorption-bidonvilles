<template>
    <div class="flex items-center">
        <div v-if="isClosed" class="flex items-center uppercase text-sm mr-4">
            <div v-if="isClosed">
                Fermée le
                {{ formatDate(plan.closed_at / 1000, "d/m/y") }}
            </div>
        </div>
        <div
            v-if="!plan.updated_at"
            class="flex items-center uppercase text-sm mr-4"
        >
            <div class="rounded-full bg-corail h-3 w-3 mr-2" />
            Déclarée le
            {{ formatDate(plan.created_at / 1000, "d/m/y") }}
        </div>
        <div v-else class="flex items-center uppercase text-sm mr-4">
            <div class="rounded-full bg-corail h-3 w-3 mr-2" />
            Mise à jour le
            {{ formatDate(plan.updated_at / 1000, "d/m/y") }}
        </div>
    </div>
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
