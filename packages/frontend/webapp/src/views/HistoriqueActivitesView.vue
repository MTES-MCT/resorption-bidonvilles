<template>
    <LayoutSearch
        :allowFreeSearch="false"
        searchTitle="Rechercher une commune, un département, une région..."
        searchPlaceholder="Nom d'une commune, d'un département, d'une région..."
        v-model:location="location"
        :paddingTop="false"
        :displayMetropoleOutremer="false"
    >
        <ContentWrapper class="pt-8">
            <FilArianne :items="ariane" class="mb-8" />
            <HistoriqueActivitesHeader
                class="sticky top-0 bg-white pt-2 pb-10 !mb-0"
            />
            <TableauDeBordActivites class="mt-8" />
        </ContentWrapper>
    </LayoutSearch>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed } from "vue";
import { useActivitiesStore } from "@/stores/activities.store";
import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import LayoutSearch from "@/components/LayoutSearch/LayoutSearch.vue";
import TableauDeBordActivites from "@/components/TableauDeBord/TableauDeBordActivites/TableauDeBordActivites.vue";
import HistoriqueActivitesHeader from "@/components/HistoriqueActivites/HistoriqueActivitesHeader.vue";

const activitiesStore = useActivitiesStore();
const ariane = [
    { label: "Accueil", to: "/" },
    { label: "Dernières activités" },
];

const location = computed({
    get() {
        return {
            search: activitiesStore.filters.search,
            data: activitiesStore.filters.location,
        };
    },
    set(newValue) {
        if (!newValue) {
            activitiesStore.filters.search = "";
            activitiesStore.filters.location = null;
        } else {
            activitiesStore.filters.search = newValue?.search;
            activitiesStore.filters.location = newValue?.data;
        }
    },
});

onMounted(() => {
    if (activitiesStore.activities.length === 0) {
        activitiesStore.fetchDefault();
    }

    window.addEventListener("scroll", reachBottom);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", reachBottom);
});

function reachBottom() {
    if (activitiesStore.isLoading === true) {
        return;
    }

    if (activitiesStore.activities.length === 0) {
        return;
    }

    if (activitiesStore.error !== null) {
        return;
    }

    const bottomOfWindow =
        document.documentElement.scrollHeight -
            document.documentElement.scrollTop -
            document.documentElement.offsetHeight <
        document.documentElement.offsetHeight;

    if (bottomOfWindow) {
        loadNext();
    }
}

function loadNext() {
    // on a déjà chargé toutes les activités : stop !
    if (activitiesStore.endOfActivities === true) {
        return;
    }

    // on est déjà en train de fetch : stop !
    if (activitiesStore.isLoading === true) {
        return;
    }

    // on fetch les activités
    activitiesStore.fetchNext();
}
</script>
