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
                title="Prévenir les risques lors des vagues de chaleur"
                description='Pensez à identifier les sites nécessitant une intervention urgente via le bouton "Alerte canicule" sur la liste des sites, et suivez les actions mises en œuvre via le journal du site.'
                :enabled="false"
            />
            <FilArianne :items="ariane" class="mb-8" />
        </ContentWrapper>
        <ListeDesSites />
    </LayoutSearch>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { useFavoritesStore } from "@/stores/favorites.store";
import { useUserStore } from "@/stores/user.store";
import { trackEvent } from "@/helpers/matomo";

import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import BandeauNotice from "@/components/BandeauNotice/BandeauNotice.vue";
import LayoutSearch from "@/components/LayoutSearch/LayoutSearch.vue";
import ListeDesSites from "@/components/ListeDesSites/ListeDesSites.vue";

const EXCLUDED_ROLES = new Set(["intervener", "external_observator"]);

const ariane = [{ label: "Accueil", to: "/" }, { label: "Sites" }];
const townsStore = useTownsStore();
const favoritesStore = useFavoritesStore();
const userStore = useUserStore();

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
        townsStore.fetchTowns();
    }

    if (!EXCLUDED_ROLES.has(userStore.user?.role_id)) {
        favoritesStore.fetch();
    }
});
</script>
