<template>
    <LayoutSearch
        :allowFreeSearch="false"
        searchTitle="Rechercher un site, une commune, un département..."
        searchPlaceholder="Nom d'une commune, d'un département, ..."
        v-model:location="location"
    >
        <HistoriqueActivites />
    </LayoutSearch>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useActivitiesStore } from "@/stores/activities.store";
import { useUserStore } from "@/stores/user.store";
import { useLocationStore } from "@/stores/location.store";
import LayoutSearch from "@/components/LayoutSearch/LayoutSearch.vue";
import HistoriqueActivites from "@/components/HistoriqueActivites/HistoriqueActivites.vue";
import router from "@/helpers/router";

const activitiesStore = useActivitiesStore();
const userStore = useUserStore();
const locationStore = useLocationStore();

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

        fetch();
    },
});
const locationType = computed(() => {
    return router.currentRoute.value.params.locationType;
});
const locationCode = computed(() => {
    return router.currentRoute.value.params.locationCode || undefined;
});
const defaultPath = computed(() => {
    const location = userStore.user?.organization.location;
    return `/activites/${location.type}/${location[location.type]?.code || ""}`;
});
const locationName = computed(() => {
    if (locationType.value === "nation") {
        return "France";
    }

    return (
        locationStore.locations[locationType.value]?.[locationCode.value]
            ?.label || null
    );
});

async function syncLocationFilterToUrl() {
    // si le filtre en place correspond déjà à l'URL, on ne fait rien
    if (
        locationType.value === "nation" &&
        activitiesStore.filters.location === null
    ) {
        return fetch();
    }

    if (
        locationType.value !== "nation" &&
        activitiesStore.filters.location?.typeUid === locationType.value &&
        activitiesStore.filters.location?.code === locationCode.value
    ) {
        return fetch();
    }

    // on set le filtre
    activitiesStore.filters.location = {
        typeUid: locationType.value,
        code: locationCode.value,
        departement: null,
        typeName: "-",
    };

    // on essaie de mettre à jour le contenu de la barre de recherche en même temps
    activitiesStore.filters.search = "";
    if (locationType.value === "nation") {
        return;
    }

    // si on a pas le nom de la localisation actuelle, c'est qu'il faut la fetch...
    if (!locationName.value) {
        await locationStore.fetchLocation(
            locationType.value,
            locationCode.value
        );
        activitiesStore.filters.search =
            locationName.value || "Localisation inconnue";
    }
}

onMounted(async () => {
    // on réécrit l'URL si l'accès se fait par "/activites"
    if (!locationType.value) {
        router.replace(defaultPath.value);
        return;
    }

    syncLocationFilterToUrl();
});

function fetch() {
    // si cette location est déjà la dernière a avoir été chargée : stop
    const loaded = activitiesStore.loaded;
    if (
        loaded.locationType === locationType.value &&
        loaded.locationCode === locationCode.value &&
        (loaded.filters.some(
            (filter) => !activitiesStore.filters.activityTypes.includes(filter)
        ) ||
            activitiesStore.filters.activityTypes.some(
                (filter) => !loaded.filters.includes(filter)
            ))
    ) {
        return;
    }

    // on fetch les activités
    activitiesStore.fetchActivities({
        location: {
            locationType: activitiesStore.filters.location?.typeUid,
            locationCode: activitiesStore.filters.location?.code,
        },
    });
}
</script>
