<template>
    <Autocomplete
        name="user"
        label="L'intervenant est-il un utilisateur de la plateforme Résorption-bidonvilles ?"
        info="Cherchez le nom de la personne en tapant au minimum les 3 premières lettres de son nom ou de son prénom."
        :fn="autocompleteFn"
    />
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Autocomplete } from "@resorptionbidonvilles/ui";
import { findRelations } from "@/api/towns.api.js";
import formatUserName from "@/utils/formatUserName";

const props = defineProps({
    townId: Number,
});
const { townId } = toRefs(props);

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
