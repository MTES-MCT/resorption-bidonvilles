<template>
    <FicheSiteResorptionPhasesInitiales
        class="shadow-md rounded p-2 mb-4"
        v-if="classified_phases?.filteredPhases?.length > 0"
        :phases_initiales="classified_phases.filteredPhases"
    />

    <template v-if="classified_phases.remainingPhases.length > 0">
        <div
            class="grid lg:grid-cols-3 justify-between items-center gap-2 mb-4"
        >
            <CartePhaseResorption
                v-for="phase in classified_phases.remainingPhases"
                :key="phase.preparatoryPhaseId"
                :phase="phase"
            />
        </div>
    </template>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { useConfigStore } from "@/stores/config.store";

import CartePhaseResorption from "@/components/CartePhaseResorption/CartePhaseResorption.vue";
import FicheSiteResorptionPhasesInitiales from "./FicheSiteResorptionPhasesInitiales.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const classified_phases = computed(() => {
    if (!town.value?.preparatoryPhasesTowardResorption) {
        return { filteredPhases: [], remainingPhases: [] };
    }

    if (!Array.isArray(town.value.preparatoryPhasesTowardResorption)) {
        return { filteredPhases: [], remainingPhases: [] };
    }

    const configStore = useConfigStore();
    const requiredPhases =
        configStore.config?.preparatory_phases_toward_resorption.reduce(
            (acc, item) => {
                if (item.is_a_starting_phase) {
                    acc.push(item.uid);
                }
                return acc;
            },
            []
        );

    const [filteredPhases, remainingPhases] =
        town.value.preparatoryPhasesTowardResorption.reduce(
            ([filtered, remaining], phase) => {
                return requiredPhases.includes(phase.preparatoryPhaseId)
                    ? [[...filtered, phase], remaining]
                    : [filtered, [...remaining, phase]];
            },
            [[], []]
        );
    return {
        filteredPhases,
        remainingPhases,
    };
});
</script>
