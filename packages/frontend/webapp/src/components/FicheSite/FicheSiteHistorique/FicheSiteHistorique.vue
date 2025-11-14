<template>
    <PanneauLateral icon="history" ref="panneauLateral">
        <template v-slot:header>Historique des modifications</template>

        <Filter
            v-model="townsStore.townCategoryFilter"
            title="Filtrer par rubrique"
            :options="filters.categories"
            class="border-1 !border-primary rounded hover:bg-blue200"
        />

        <FicheSiteHistoriqueItem
            v-if="town.closedAt"
            :author="town.updatedBy"
            :date="town.updatedAt"
            >Fermeture du site</FicheSiteHistoriqueItem
        >

        <p
            class="text-sm mt-4"
            :class="filteredChangelog.length < 1 ? 'mb-4' : ''"
        >
            <span class="font-bold"
                >{{
                    filteredChangelog.length >= 1
                        ? filteredChangelog.length
                        : "Aucune"
                }}
                modification{{ filteredChangelog.length > 1 ? "s" : "" }}</span
            ><br />
            <span v-if="townsStore.townCategoryFilter.length"
                >correspondant à vos filtres, sur un total de
                {{ town.changelog.length }} modifications</span
            >
        </p>

        <FicheSiteHistoriqueItem
            v-for="changelog in filteredChangelog"
            :key="changelog.id"
            :author="changelog.author"
            :date="changelog.date"
            :diff="changelog.diff"
        />

        <FicheSiteHistoriqueItem :author="town.createdBy" :date="town.createdAt"
            >Déclaration du site</FicheSiteHistoriqueItem
        >
    </PanneauLateral>
</template>

<script setup>
import { defineProps, toRefs, ref, defineExpose, computed } from "vue";
import filters from "../FicheSite.filter";
import { useTownsStore } from "@/stores/towns.store";

import { Filter } from "@resorptionbidonvilles/ui";
import { PanneauLateral } from "@resorptionbidonvilles/ui";
import FicheSiteHistoriqueItem from "./FicheSiteHistoriqueItem/FicheSiteHistoriqueItem.vue";

const townsStore = useTownsStore();
const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const panneauLateral = ref(null);

const open = () => {
    if (panneauLateral.value) {
        panneauLateral.value.open();
    }
};

defineExpose({
    open,
});

function checkFilter(field) {
    let res = false;
    townsStore.townCategoryFilter.forEach((category) => {
        if (filters.fields[category].includes(field)) {
            res = true;
        }
    });
    return res;
}

const filteredChangelog = computed(() => {
    // On exclut au préalable les diffs mentionnant un passage de true à false sans autre changement
    const preFilteredChangelog = town.value.changelog.map((change) => {
        return {
            ...change,
            diff: removeUpdatedWithoutAnyChangeFromTrueToFalse(change.diff),
        };
    });

    if (townsStore.townCategoryFilter.length === 0) {
        return preFilteredChangelog.filter(
            (change) => change.diff.length !== 0
        );
    }

    const returnValue = preFilteredChangelog
        .map((change) => {
            return {
                ...change,
                diff: change.diff.filter((difference) => {
                    return checkFilter(difference.fieldKey);
                }),
            };
        })
        .filter((change) => change.diff.length !== 0);
    return returnValue;
});

function removeUpdatedWithoutAnyChangeFromTrueToFalse(diff) {
    return diff.filter((item) => {
        if (
            item.fieldKey !== "updatedWithoutAnyChange" ||
            (item.fieldKey === "updatedWithoutAnyChange" && item.newValue)
        ) {
            return item;
        }
        return;
    });
}
</script>
