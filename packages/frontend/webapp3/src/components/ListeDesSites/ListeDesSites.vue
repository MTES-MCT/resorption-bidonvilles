<template>
    <ContentWrapper>
        <TabList :tabs="tabs" v-model="currentTab" class="mb-4 print:hidden" />

        <ViewHeader icon="tent">
            <template v-slot:title>Liste des sites</template>
            <template v-slot:description
                >Consultez et gérez la liste des sites au national ou sur votre
                territoire</template
            >
            <template v-slot:actions>
                <ListeDesSitesActions />
            </template>
        </ViewHeader>

        <Loading v-if="townsStore.isLoading !== false" />
        <ListeDesSitesErreur v-else-if="townsStore.error" />

        <template v-else>
            <ListeDesSitesStatistiques />
            <ListeDesSitesFiltres class="mt-4" />
            <ListeDesSitesListe
                class="mt-4"
                v-if="townsStore.filteredTowns.length > 0"
            />
            <ListeDesSitesVide v-else class="mt-10" />
        </template>
    </ContentWrapper>
</template>

<script setup>
import { computed, watch } from "vue";
import { useTownsStore } from "@/stores/towns.store";

import { TabList } from "@resorptionbidonvilles/ui";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import Loading from "@/components/Loading/Loading.vue";
import ListeDesSitesActions from "./ListeDesSitesActions.vue";
import ListeDesSitesStatistiques from "./ListeDesSitesStatistiques.vue";
import ListeDesSitesFiltres from "./ListeDesSitesFiltres.vue";
import ListeDesSitesErreur from "./ListeDesSitesErreur.vue";
import ListeDesSitesListe from "./ListeDesSitesListe.vue";
import ListeDesSitesVide from "./ListeDesSitesVide.vue";

const townsStore = useTownsStore();
const tabs = [
    { id: "open", label: "Sites existants" },
    { id: "close", label: "Sites fermés" },
];
const currentTab = computed({
    get() {
        return townsStore.filters.status;
    },
    set(newValue) {
        townsStore.filters.status = newValue;
    },
});

watch(currentTab, () => {
    if (currentTab.value === "close") {
        townsStore.sort = "closedAt";
    } else {
        townsStore.sort = "updatedAt";
    }
});
</script>
