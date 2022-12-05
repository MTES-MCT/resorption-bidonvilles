<template>
    <ContentWrapper>
        <TabList :tabs="tabs" v-model="currentTab" class="mb-4" />
        <ListeDesActionsHeader />

        <Loading v-if="plansStore.isLoading !== false" />
        <ListeDesActionsErreur v-else-if="plansStore.error" />

        <template v-else>
            <ListeDesActionsStatistiques />
            <ListeDesActionsFiltres class="mt-4" />
            <ListeDesActionsListe
                class="mt-4"
                v-if="plansStore.filteredPlans.length > 0"
            />

            <ListeDesActionsVide v-else class="mt-10" />
        </template>
    </ContentWrapper>
</template>

<script setup>
import { computed } from "vue";
import { usePlansStore } from "@/stores/plans.store";
import { TabList } from "@resorptionbidonvilles/ui";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import Loading from "@/components/Loading/Loading.vue";
import ListeDesActionsHeader from "./ListeDesActionsHeader.vue";
import ListeDesActionsErreur from "./ListeDesActionsErreur.vue";
import ListeDesActionsStatistiques from "./ListeDesActionsStatistiques.vue";
import ListeDesActionsFiltres from "./ListeDesActionsFiltres.vue";
import ListeDesActionsListe from "./ListeDesActionsListe.vue";
import ListeDesActionsVide from "./ListeDesActionsVide.vue";

const plansStore = usePlansStore();

const tabs = [{ id: "open", label: "Actions existantes" }];
const currentTab = computed({
    get() {
        return plansStore.filters.status;
    },
    set(newValue) {
        plansStore.filters.status = newValue;
    },
});
</script>
