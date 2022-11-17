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
import { watch, onMounted, onUnmounted, computed } from "vue";
import { useActivitiesStore } from "@/stores/activities.store";
import LayoutSearch from "@/components/LayoutSearch/LayoutSearch.vue";
import HistoriqueActivites from "@/components/HistoriqueActivites/HistoriqueActivites.vue";

const activitiesStore = useActivitiesStore();

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
            activitiesStore.filters.location = { typeUid: "nation" };
        } else {
            activitiesStore.filters.search = newValue?.search;
            activitiesStore.filters.location = newValue.data || {
                typeUid: "nation",
            };
        }
        fetch();
    },
});
const locationType = computed(() => {
    return location.value.typeUid;
});
const locationCode = computed(() => {
    return location.value.code || undefined;
});

function reachBottom() {
    let bottomOfWindow =
        document.documentElement.scrollHeight -
            document.documentElement.scrollTop -
            document.documentElement.offsetHeight <
        document.documentElement.offsetHeight;
    if (bottomOfWindow) {
        loadNext();
    }
}
watch(activitiesStore.filters.properties, activitiesStore.resetPage, {
    deep: true,
});

onMounted(() => {
    if (!activitiesStore.filters.location) {
        activitiesStore.filters.location = { typeUid: "nation", code: null };
    }
    if (activitiesStore.activities.length === 0) {
        fetch();
    }
    window.addEventListener("scroll", reachBottom);
});

onUnmounted(() => {
    activitiesStore.reset();
    window.removeEventListener("scroll", reachBottom);
});

async function loadNext() {
    // on a déjà chargé toutes les activités : stop !
    if (activitiesStore.endOfActivities === true) {
        return;
    }

    // on est déjà en train de fetch : stop !
    if (activitiesStore.isLoading === true) {
        return;
    }

    // on fetch les activités
    activitiesStore.fetchActivities({});
}

async function fetch() {
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
    await activitiesStore.fetchActivities({
        location: {
            locationType: activitiesStore.filters.location?.typeUid,
            locationCode: activitiesStore.filters.location?.code,
        },
    });
}
</script>
