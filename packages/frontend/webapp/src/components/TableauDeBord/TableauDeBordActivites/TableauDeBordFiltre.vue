<template>
    <button
        :class="[
            'mb-4 cursor-pointer text-left',
            isActive
                ? 'text-primary border-l-4 pl-2 border-primary font-bold'
                : 'hover:underline',
            focusClasses.ring,
        ]"
        :aria-labelledby="isActive ? `Filtre actif : ${label}` : label"
        @click="setFilter"
    >
        {{ label }}
    </button>
</template>

<script setup>
import { useDashboardStore } from "@/stores/dashboard.store";
import { defineProps, toRefs, computed } from "vue";
import { trackEvent } from "@/helpers/matomo";
import focusClasses from "@common/utils/focus_classes";

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
