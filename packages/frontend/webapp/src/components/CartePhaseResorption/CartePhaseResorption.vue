<template>
    <div
        class="p-2 border-1 border-primary/20 rounded w-full col-span-3 lg:col-span-1 bg-white"
    >
        <div
            class="mb-2 p-1 rounded text-sm font-bold"
            :class="is_initial_phase ? 'bg-blue200' : 'bg-G200'"
        >
            {{ phase.preparatoryPhaseName }}
        </div>
        <div class="flex justify-start items-center text-sm">
            <div class="flex flex-row flex-wrap md:flex-auto gap-1">
                <div class="flex flex-row shrink-0 gap-1">
                    <i
                        class="w-4 h-4 rounded-full"
                        :class="`bg-${iconColor}`"
                    />
                    {{ statusText }}
                </div>
                <div v-if="phase.completedAt" class="shrink-0">
                    {{ formattedDate }}
                </div>
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
    is_initial_phase: {
        type: Boolean,
        default: false,
        required: false,
    },
});

const { phase, is_initial_phase } = toRefs(props);

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
