<template>
    <span
        :class="[
            'mb-4 cursor-pointer',
            isActive
                ? 'text-primary border-l-4 pl-2 border-primary font-bold'
                : 'hover:underline',
        ]"
        @click="setFilter"
    >
        {{ label }}
    </span>
</template>

<script setup>
import { useDashboardStore } from "@/stores/dashboard.store";
import { toRefs, computed } from "vue";
import { trackEvent } from "@/helpers/matomo";

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    track_id: {
        type: String,
        required: true,
    },
});
const { id, label, track_id } = toRefs(props);
const dashboardStore = useDashboardStore();

const isActive = computed(() => {
    return dashboardStore.activities.filter === id.value;
});

function setFilter() {
    if (isActive.value) {
        return;
    }

    trackEvent("TB", `Activité ${track_id.value}`);
    dashboardStore.activities.filter = id.value;
}
</script>
