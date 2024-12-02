<template>
    <p class="text-md font-bold mb-4">Étapes de la résorption</p>
    <ul class="border-1 my-4">
        <li
            v-for="phase in preparatory_phases_toward_resorption_value"
            :key="phase"
            class="mb-2"
        >
            <span class="font-bold">{{ `phase_${phase}_completed_at` }} :</span>
            {{
                values[`phase_${phase}_completed_at`] === null
                    ? "Non renseignée"
                    : values[`phase_${phase}_completed_at`]
            }}
        </li>
    </ul>
    <CheckableGroup id="preparatory_phases_toward_resorption">
        <InputResorptionPhaseItem
            v-for="(item, index) in preparatory_phases_toward_resorption"
            v-model="preparatory_phases_toward_resorption_value"
            :phase="item"
            :activePhases="activeValues"
            :index="index"
            :key="item.uid"
            class="mb-6"
        />
    </CheckableGroup>
</template>

<script setup>
import { useFieldValue, useFormValues } from "vee-validate";
import { CheckableGroup } from "@resorptionbidonvilles/ui";
import InputResorptionPhaseItem from "./FormDeclarationDeSiteInputResorptionPhaseItem.vue";
import { useConfigStore } from "@/stores/config.store";

const configStore = useConfigStore();
const preparatory_phases_toward_resorption =
    configStore.config?.preparatory_phases_toward_resorption || [];
const values = useFormValues();
const preparatory_phases_toward_resorption_value = useFieldValue(
    "preparatory_phases_toward_resorption"
);
const activeValues = useFieldValue(
    "active_preparatory_phases_toward_resorption"
);
</script>
