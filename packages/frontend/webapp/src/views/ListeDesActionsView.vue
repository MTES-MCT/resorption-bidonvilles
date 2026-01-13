<template>
    <LayoutSearch
        allowFreeSearch
        searchTitle=" Rechercher une action, une commune, un département, un acteur..."
        searchPlaceholder="Nom d'une action, commune, département, acteur..."
        showNationalWording="Voir toutes les actions de France"
        v-model:location="location"
    >
        <ContentWrapper>
            <FilArianne :items="ariane" class="mb-8" />
        </ContentWrapper>
        <ListeDesActions />
    </LayoutSearch>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useActionsStore } from "@/stores/actions.store";
import { useRouter } from "vue-router";

import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import LayoutSearch from "@/components/LayoutSearch/LayoutSearch.vue";
import ListeDesActions from "@/components/ListeDesActions/ListeDesActions.vue";

const ariane = [{ label: "Accueil", to: "/" }, { label: "Actions" }];

const actionsStore = useActionsStore();
const router = useRouter();

const location = computed({
    get() {
        return {
            search: actionsStore.filters.search,
            data: actionsStore.filters.location,
        };
    },

    set(newValue) {
        if (newValue) {
            if (newValue?.data?.type === "action") {
                router.push(`/action/${newValue.data.actionId}`);
                return;
            }
            actionsStore.filters.search = newValue?.search;
            actionsStore.filters.location = newValue?.data;
        } else {
            actionsStore.filters.search = "";
            actionsStore.filters.location = null;
        }
    },
});

onMounted(() => {
    if (actionsStore.actions.length === 0) {
        load();
    }
});

function load() {
    actionsStore.fetchActions();
}
</script>
