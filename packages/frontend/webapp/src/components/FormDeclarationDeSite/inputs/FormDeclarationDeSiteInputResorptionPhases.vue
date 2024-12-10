<template>
    <CheckableGroup id="preparatory_phases_toward_resorption">
        <InputResorptionPhaseItem
            v-for="(item, index) in preparatory_phases_toward_resorption"
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
</script>
