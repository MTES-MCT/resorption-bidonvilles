<template>
    <ContentWrapper>
        <TabList :tabs="tabs" v-model="currentTab" class="mb-4" />
        <ListeDesActionsHeader :years="years" />

        <Loading v-if="actionsStore.isLoading !== false" />
        <ListeDesActionsErreur v-else-if="actionsStore.error" />

        <template v-else>
            <ListeDesActionsStatistiques />
            <ListeDesActionsFiltres class="mt-4" />
            <ListeDesActionsListe
                class="mt-4"
                v-if="actionsStore.filteredActions[currentTab].length > 0"
            />

            <ListeDesActionsVide v-else class="mt-10" />
        </template>
    </ContentWrapper>
</template>

<script setup>
import { computed } from "vue";
import { useActionsStore } from "@/stores/actions.store";
import pluralize from "@/utils/pluralize";
import computeCandidateYears from "@/utils/computeCandidateYears";
import { ContentWrapper, TabList } from "@resorptionbidonvilles/ui";
import Loading from "@/components/Loading/Loading.vue";
import ListeDesActionsHeader from "./ListeDesActionsHeader.vue";
import ListeDesActionsErreur from "./ListeDesActionsErreur.vue";
import ListeDesActionsStatistiques from "./ListeDesActionsStatistiques.vue";
import ListeDesActionsFiltres from "./ListeDesActionsFiltres.vue";
import ListeDesActionsListe from "./ListeDesActionsListe.vue";
import ListeDesActionsVide from "./ListeDesActionsVide.vue";

const actionsStore = useActionsStore();

const tabs = computed(() => {
    const initialTabs = [
        {
            id: "open",
            label: pluralize(
                actionsStore.filteredActions["open"].length,
                "Action en cours",
                "Actions en cours"
            ),
            total: actionsStore.filteredActions["open"].length,
        },
        {
            id: "myOrganization",
            label: pluralize(
                actionsStore.filteredActions["myOrganization"].length,
                "action de ma structure",
                "actions de ma structure"
            ),
            total: actionsStore.filteredActions["myOrganization"].length,
        },
        {
            id: "closed",
            label: pluralize(
                actionsStore.filteredActions["closed"].length,
                "Action terminée",
                "Actions terminées"
            ),
            total: actionsStore.filteredActions["closed"].length,
        },
    ];

    return initialTabs.filter(
        (tab) =>
            tab.id !== "myOrganization" ||
            actionsStore.filteredActions["myOrganization"].length > 0
    );
});

const currentTab = computed({
    get() {
        return actionsStore.filters.status;
    },
    set(newValue) {
        actionsStore.filters.status = newValue;
    },
});

// Années candidates à l'export : de la plus ancienne date de début des actions affichées à l'année en cours
const years = computed(function computeYears() {
    return computeCandidateYears(
        actionsStore.filteredActions[currentTab.value]
    );
});
</script>
