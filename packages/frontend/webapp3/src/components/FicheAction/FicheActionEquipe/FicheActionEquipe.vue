<template>
    <FicheRubrique title="Équipe" id="equipe">
        <TableauRb class="my-4" :columns="columns" :data="data" />
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import formatDate from "@/utils/formatDate";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import TableauRb from "@/components/Tableau/TableauRb.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

const configStore = useConfigStore();

const etpTypes = computed(() => {
    return configStore.config.etp_types;
});
const columns = computed(() => {
    return [
        { id: "label", label: "" },
        ...plan.value.states.map((state, index) => {
            return {
                id: index,
                label: formatDate(
                    new Date(state.date).getTime() / 1000,
                    "d B y"
                ),
            };
        }),
    ];
});
const availableEtpTypes = computed(() => {
    return etpTypes.value.filter(({ uid }) =>
        plan.value.states.some(({ etp }) =>
            etp.some(({ type: { uid: u } }) => uid === u)
        )
    );
});
const data = computed(() => {
    return availableEtpTypes.value.map((etpType) => {
        const row = {
            label: etpType.name,
        };

        return plan.value.states.reduce((acc, state, index) => {
            return {
                ...acc,
                [index]: (
                    state.etp.find(
                        ({ type: { uid } }) => uid === etpType.uid
                    ) || { total: 0 }
                ).total,
            };
        }, row);
    });
});
</script>
