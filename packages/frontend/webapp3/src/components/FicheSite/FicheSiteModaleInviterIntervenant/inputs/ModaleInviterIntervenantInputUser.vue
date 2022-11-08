<template>
    <Autocomplete
        name="user"
        label="L'intervenant est-il un utilisateur de la plateforme Résorption-bidonvilles ?"
        info="Cherchez le nom de la personne en tapant au minimum les 3 premières lettres de son nom ou de son prénom."
        :fn="autocompleteFn"
        v-model="user"
    />
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits } from "vue";
import { Autocomplete } from "@resorptionbidonvilles/ui";
import { findRelations } from "@/api/towns.api.js";
import formatUserName from "@/utils/formatUserName";

const props = defineProps({
    townId: Number,
    modelValue: {
        type: Object,
        required: false,
        default: () => undefined,
    },
});
const { townId, modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);
const user = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

async function autocompleteFn(value) {
    const { relations } = await findRelations(townId.value, value);

    return relations.map((relation) => ({
        id: relation.id,
        label: formatUserName(relation),
        data: {
            id: relation.id,
        },
    }));
}
</script>
