<template>
    <InputShantytowns
        id="reinstallation_incoming_towns"
        name="reinstallation_incoming_towns"
        :label="labels.reinstallation_incoming_towns"
        :filter="filter"
        :columns="['city', 'address', 'fieldType', 'population', 'closedAt']"
    >
        <template v-slot:info>
            À l'aide du tableau ci-dessous sélectionnez les sites où vivaient
            précédemment les habitants du site en cours de saisie. Le tableau
            liste les sites ouverts à date et les sites fermés trois mois avant
            ou après l'installation de celui-ci.
        </template>
    </InputShantytowns>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useFieldValue } from "vee-validate";
import InputShantytowns from "@/components/InputShantytowns/InputShantytowns.vue";
import labels from "@/components/Common/FormEtFicheSite.labels";

const props = defineProps({
    departement: {
        type: Object,
        required: true,
    },
    id: {
        // id du site en cours de modification (le cas échéant)
        type: Number,
        required: false,
    },
});
const { departement, id } = toRefs(props);
const builtAt = useFieldValue("built_at");

function filter(town) {
    if (departement.value.code !== town.departement.code) {
        return false;
    }

    // on interdit de s'auto-référencer
    if (id.value === town.id) {
        return false;
    }

    // on ne conserve que les sites ouverts ou les sites fermés dans la période allant de
    // 90 jours avant jusqu'à 90 jours après la date d'installation du site courant
    if (town.closedAt === null) {
        return true;
    }

    const dateRef = builtAt.value || new Date();
    dateRef.setHours(0, 0, 0, 0);

    const maxDate = new Date(dateRef);
    maxDate.setDate(maxDate.getDate() + 89);

    const minDate = new Date(dateRef);
    minDate.setDate(minDate.getDate() - 89);

    return (
        town.closedAt <= maxDate.getTime() / 1000 &&
        town.closedAt >= minDate.getTime() / 1000
    );
}
</script>
