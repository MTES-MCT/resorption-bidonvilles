<template>
    <template v-if="phasesStartingResorption.length > 0">
        <div class="p-2 border-1 border-primary rounded text-sm mt-2 mb-4">
            <div
                class="bg-G200 p-2 rounded text-sm font-bold mt-2 mb-3"
                v-if="phasesStartingResorption"
            >
                Phase initiale
            </div>
            <CheckableGroup
                id="preparatory_phases_toward_resorption"
                class="!mb-2"
            >
                <InputResorptionPhaseItem
                    v-for="(item, index) in phasesStartingResorption"
                    v-model="preparatory_phases_toward_resorption_value"
                    :phase="item"
                    :activePhases="activeValues"
                    :index="index"
                    :key="item.uid"
                    :withBorder="false"
                />
            </CheckableGroup>
        </div>
    </template>

    <CheckableGroup id="preparatory_phases_toward_resorption">
        <InputResorptionPhaseItem
            v-for="(item, index) in phasesNotStartingResorption"
            v-model="preparatory_phases_toward_resorption_value"
            :phase="item"
            :activePhases="activeValues"
            :index="index"
            :key="item.uid"
            class="my-2"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { useFieldValue } from "vee-validate";
import { CheckableGroup } from "@resorptionbidonvilles/ui";
import InputResorptionPhaseItem from "./FormDeclarationDeSiteInputResorptionPhaseItem.vue";
import { useConfigStore } from "@/stores/config.store";

const configStore = useConfigStore();

const preparatory_phases_toward_resorption =
    configStore.config?.preparatory_phases_toward_resorption.sort(
        (a, b) => a.position - b.position
    ) || [];

const preparatory_phases_toward_resorption_value = useFieldValue(
    "preparatory_phases_toward_resorption"
);

const activeValues = useFieldValue(
    "active_preparatory_phases_toward_resorption"
);

const phasesStartingResorption = computed(() =>
    preparatory_phases_toward_resorption.filter(
        (phase) => phase.is_a_starting_phase
    )
);

const phasesNotStartingResorption = computed(() =>
    preparatory_phases_toward_resorption.filter(
        (phase) => !phase.is_a_starting_phase
    )
);
</script>
