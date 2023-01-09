<template>
    <TableauRb :columns="columns" :data="rows">
        <template v-slot:cell="{ column, row, content }">
            <span v-if="column === 'label'" class="whitespace-pre-line">
                {{ content }}
            </span>
            <TextInput
                :name="`audience.${rows[row].type}.${column}`"
                v-else
                type="number"
            /> </template
    ></TableauRb>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";

import TableauRb from "@/components/Tableau/TableauRb.vue";
import TextInput from "@resorptionbidonvilles/ui/src/components/Input/TextInput.vue";

const props = defineProps({
    mode: String,
});

const { mode } = toRefs(props);

const columns = ref([
    { id: "label", label: "" },
    { id: "families", label: "Ménages" },
    { id: "total", label: "Personnes" },
    { id: "women", label: "dont femmes (facultatif)" },
    { id: "minors", label: "dont mineurs (facultatif)" },
]);

const rows = computed(() => {
    const inRows = [
        {
            label:
                mode.value === "in_only"
                    ? "Publics intégrés à l'action"
                    : "Entrées dans l'action",
            type: "in",
        },
    ];
    const outRows = [
        {
            label: `Sorties positivement
                        fin d'accompagnement social et/ou prise en charge dans une autre action`,
            type: "out_positive",
        },
        {
            label: "Exclusion de l'action",
            type: "out_excluded",
        },
        {
            label: "Abandon / départ volontaire",
            type: "out_abandoned",
        },
    ];
    if (mode.value === "in_only") {
        return inRows;
    }
    if (mode.value === "out_only") {
        return outRows;
    }
    return [...inRows, ...outRows];
});
</script>
