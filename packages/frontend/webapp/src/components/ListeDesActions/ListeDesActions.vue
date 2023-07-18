<template>
    <ContentWrapper>
        <TabList :tabs="tabs" v-model="currentTab" class="mb-4" />
        <ListeDesActionsHeader />

        <Loading v-if="actionsStore.isLoading !== false" />
        <ListeDesActionsErreur v-else-if="actionsStore.error" />

        <template v-else>
            <ListeDesActionsStatistiques />
            <ListeDesActionsFiltres class="mt-4" />
            <ListeDesActionsListe
                class="mt-4"
                v-if="actionsStore.filteredActions.length > 0"
            />

            <ListeDesActionsVide v-else class="mt-10" />
        </template>
    </ContentWrapper>
</template>

<script setup>
import { computed } from "vue";
import { useActionsStore } from "@/stores/actions.store";
import { ContentWrapper, TabList } from "@resorptionbidonvilles/ui";
import Loading from "@/components/Loading/Loading.vue";
import ListeDesActionsHeader from "./ListeDesActionsHeader.vue";
import ListeDesActionsErreur from "./ListeDesActionsErreur.vue";
import ListeDesActionsStatistiques from "./ListeDesActionsStatistiques.vue";
import ListeDesActionsFiltres from "./ListeDesActionsFiltres.vue";
import ListeDesActionsListe from "./ListeDesActionsListe.vue";
import ListeDesActionsVide from "./ListeDesActionsVide.vue";

const actionsStore = useActionsStore();

const tabs = [
    { id: "open", label: "Actions en cours" },
    { id: "closed", label: "Actions terminées" },
];
const currentTab = computed({
    get() {
        return actionsStore.filters.status;
    },
    set(newValue) {
        actionsStore.filters.status = newValue;
    },
});
</script>
