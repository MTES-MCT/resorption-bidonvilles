<template>
    <div class="p-2 border-1 border-primary rounded w-full">
        <div class="bg-G200 mb-2 p-1 rounded text-sm font-bold">
            {{ phase.preparatoryPhaseName }}
        </div>
        <div class="flex justify-between items-center text-sm">
            <div class="flex items-center gap-1">
                <i class="w-4 h-4 rounded-full" :class="`bg-${iconColor}`"></i>
                {{ statusText }}
                <span v-if="phase.completedAt">
                    {{ formattedDate }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, toRefs } from "vue";

// Définition des props
const props = defineProps({
    phase: {
        type: Object,
        required: true,
    },
});

const { phase } = toRefs(props);

const status = computed(() => {
    return phase.value.completedAt ? "done" : "inprogress";
});

const statusText = computed(() => {
    return status.value === "done"
        ? props.phase.preparatoryPhaseDateLabel
        : "En cours";
});

const formattedDate = computed(() => {
    if (!phase.value.completedAt) {
        return "";
    }

    return new Date(phase.value.completedAt * 1000).toLocaleDateString(
        "fr-FR",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );
});

const iconColor = computed(() => {
    return status.value === "done"
        ? "green"
        : status.value === "inprogress"
        ? "orange600"
        : "G500";
});
</script>
