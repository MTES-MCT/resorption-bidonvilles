<template>
    <AsyncSelect
        name="type"
        id="type"
        :options="options"
        :loader="fetchOrganizationTypes"
        info="Les structures sont regroupées par type sur la plateforme. Si le type de structure que vous cherchez n'est pas dans la liste, vous pouvez le créer en choisissant l'option 'Autre' dans la liste."
        width="w-128"
    />
</template>

<script setup>
import { computed, ref } from "vue";

import { AsyncSelect } from "@resorptionbidonvilles/ui";
import { getAllOrganizationTypes } from "@/api/organization_types.api";

const types = ref([]);
async function fetchOrganizationTypes() {
    if (types.value.length > 0) {
        return true;
    }

    const response = await getAllOrganizationTypes();
    types.value = response;
}

const options = computed(() => {
    const arr = types.value.map(({ id, abbreviation, name_singular }) => ({
        id,
        label: abbreviation || name_singular,
        name_singular,
    }));
    if (arr.length > 0) {
        arr.push({ id: "new", label: "Autre" });
    }

    arr.sort((a, b) => {
        const labelA = a.label || a.name_singular;
        const labelB = b.label || b.name_singular;

        return labelA.localeCompare(labelB);
    });
    return arr;
});
</script>
