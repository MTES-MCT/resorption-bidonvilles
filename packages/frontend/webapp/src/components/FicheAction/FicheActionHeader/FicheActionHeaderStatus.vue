<template>
    <p class="flex items-center uppercase text-sm space-x-2">
        <span
            class="inline-block rounded-full h-3 w-3"
            :class="isClosed ? 'bg-corail' : 'bg-green'"
        />

        <span>
            <template v-if="isClosed">
                Terminée le {{ formatDate(action.ended_at / 1000, "d/m/y") }}
            </template>

            <template v-else-if="action.updated_at">
                Mise à jour le
                {{ formatDate(action.updated_at / 1000, "d/m/y") }}
            </template>

            <template v-else>
                Déclarée le {{ formatDate(action.created_at / 1000, "d/m/y") }}
            </template>
        </span>
    </p>
</template>

<script setup>
import { toRefs, computed } from "vue";
import formatDate from "@/utils/formatDate";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);

const isClosed = computed(() => {
    return action.value.ended_at && action.value.ended_at < Date.now();
});
</script>
