<template>
    <div class="flex">
        <div
            class="bg-white border-t print:hidden relative"
            :class="filtersAreOpen ? 'w-72' : ''"
        >
            <CartographieFiltres
                @open="filtersAreOpen = true"
                @close="filtersAreOpen = false"
                @filterUse="onFilterUse"
                :isOpen="filtersAreOpen"
            />
        </div>
        <div class="flex-1" style="height: 100vh">
            <CartoNationale
                id="carte"
                ref="carte"
                :isLoading="!timedOut"
                :defaultView="defaultView"
                :towns="towns"
                :pois="pois"
                @townclick="onTownClick"
                @poiclick="onPoiClick"
                @viewchange="onViewChange"
                @addressVisibilityChange="onAddressVisibilityChange"
                @zoomend="onZoomChange"
                v-model:showAddresses="mapStore.showAddresses"
            />
            <CartographieQuickviewTown
                ref="quickviewTown"
                :open="mapStore.quickview.town?.open || false"
                :town="mapStore.quickview.town?.data"
                @close="onQuickviewTownClose"
            />
            <CartographieQuickviewPoi
                ref="quickviewPoi"
                :open="mapStore.quickview.poi?.open || false"
                :poi="mapStore.quickview.poi?.data"
                @close="onQuickviewPoiClose"
            />
        </div>
    </div>
</template>

<script setup>
import {
    onMounted,
    ref,
    computed,
    watch,
    nextTick,
    onBeforeUnmount,
} from "vue";
import { storeToRefs } from "pinia";
import { useMapStore } from "@/stores/map.store";
import { useUserStore } from "@/stores/user.store";
import { trackEvent } from "@/helpers/matomo";

import CartoNationale from "@/components/CartoNationale/CartoNationale.vue";
import CartographieQuickviewTown from "./CartographieQuickviewTown.vue";
import CartographieQuickviewPoi from "./CartographieQuickviewPoi.vue";
import CartographieFiltres from "./CartographieFiltres.vue";
import waitForElement from "@/utils/waitForElement";

const mapStore = useMapStore();
const { filtersAreOpen } = storeToRefs(mapStore);
const carte = ref(null);
const quickviewTown = ref(null);
const quickviewPoi = ref(null);
const timedOut = ref(false);

const stats = ref({
    filters: [],
    numberOfZooms: 0,
    numberOfClickedTowns: 0,
    addressVisibilityChanges: 0,
});

// l'initialisation de la carte a tendance à faire freezer le navigateur
// pour éviter cet effet, on délaie l'injection des sites et POIs d'une demi-seconde, ce qui laisse
// le temps au navigateur de faire le premier rendu sans lag
setTimeout(() => (timedOut.value = true), 500);

const towns = computed(() => {
    if (timedOut.value === false) {
        return [];
    }

    return mapStore.filteredTowns;
});

const pois = computed(() => {
    if (timedOut.value === false) {
        return [];
    }

    return mapStore.filteredPois;
});

const DEFAULT_ZOOMS = {
    metropole: 6,
    nation: 6,
    region: 6,
    departement: 10,
    epci: 10,
    city: 10,
    default: 10,
};

const defaultView = computed(() => {
    const userStore = useUserStore();

    if (mapStore.lastView) {
        return mapStore.lastView;
    }

    const location = userStore.firstMainArea;
    return {
        center: [location.latitude, location.longitude],
        zoom: DEFAULT_ZOOMS[location.type] || DEFAULT_ZOOMS.default,
    };
});

onMounted(() => {
    stats.value.filters = [];
    stats.value.numberOfZooms = 0;
    stats.value.numberOfClickedTowns = 0;
    stats.value.addressVisibilityChanges = 0;

    waitForElement("#carte", (el) => {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    });
});

onBeforeUnmount(() => {
    if (stats.value.filters.length > 0) {
        trackEvent(
            "Cartographie",
            "Filtres sur une session",
            stats.value.filters.join(", ")
        );
    }

    if (stats.value.numberOfZooms > 0) {
        trackEvent(
            "Cartographie",
            "Zooms sur une session",
            stats.value.numberOfZooms
        );
    }

    if (stats.value.numberOfClickedTowns > 0) {
        trackEvent(
            "Cartographie",
            "Clics sur un site sur une session",
            stats.value.numberOfClickedTowns
        );
    }

    if (stats.value.addressVisibilityChanges > 0) {
        trackEvent(
            "Cartographie",
            "Visibilité de l'adresse sur une session",
            stats.value.addressVisibilityChanges
        );
    }
});

function onFilterUse(id) {
    if (!stats.value.filters.includes(id)) {
        stats.value.filters.push(id);
    }
}

function onZoomChange() {
    stats.value.numberOfZooms += 1;
}

function onAddressVisibilityChange() {
    stats.value.addressVisibilityChanges += 1;
}

watch(filtersAreOpen, () => {
    nextTick(carte.value.resize);
});

function onTownClick(town) {
    if (!town.id) {
        return;
    }

    mapStore.quickview.poi = null;
    mapStore.quickview.town = {
        open: true,
        data: town,
    };
    quickviewTown.value.open();
    stats.value.numberOfClickedTowns += 1;
    trackEvent("Cartographie", "Click sur site", `S${town.id}`);
}

function onPoiClick(poi) {
    mapStore.quickview.town = null;
    mapStore.quickview.poi = {
        open: true,
        data: poi,
    };
    quickviewPoi.value.open();
    trackEvent("POI", "Open POI", `P${poi.lieu_id}`);
}

function onQuickviewTownClose() {
    mapStore.quickview.town = null;
}

function onQuickviewPoiClose() {
    mapStore.quickview.poi = null;
}

function onViewChange(view) {
    mapStore.lastView = view;
}
</script>
