<template>
    <LayoutSearch
        allowFreeSearch
        searchTitle="Rechercher un site, une commune, un département..."
        searchPlaceholder="Adresse, nom d'un site, ville, code postal..."
        showNationalWording="Voir tous les sites de France"
        v-model:location="location"
    >
        <ContentWrapper>
            <BandeauNotice
                class="-mt-6"
                type="warning"
                title="Prévenir les risques lors des vagues de chaleur estivales"
                description="Pensez à identifier les sites nécessitant une intervention urgente via le bouton Alerte Canicule sur la liste des sites, et suivez les actions mises en œuvre via le journal du site."
            />
            <FilArianne :items="ariane" class="mb-8" />
        </ContentWrapper>
        <ListeDesSites />
    </LayoutSearch>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { trackEvent } from "@/helpers/matomo";

import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import LayoutSearch from "@/components/LayoutSearch/LayoutSearch.vue";
import ListeDesSites from "@/components/ListeDesSites/ListeDesSites.vue";
import BandeauNotice from "@/components/BandeauNotice/BandeauNotice.vue";

const ariane = [{ label: "Accueil", to: "/" }, { label: "Sites" }];
const townsStore = useTownsStore();
const location = computed({
    get() {
        return {
            search: townsStore.filters.search,
            data: townsStore.filters.location,
        };
    },
    set(newValue) {
        trackEvent("Liste des sites", "Recherche");

        if (!newValue) {
            townsStore.filters.search = "";
            townsStore.filters.location = null;
        } else {
            townsStore.filters.search = newValue?.search;
            townsStore.filters.location = newValue?.data;
        }
    },
});

onMounted(() => {
    if (townsStore.towns.length === 0) {
        load();
    }
});

function load() {
    townsStore.fetchTowns();
}
</script>
