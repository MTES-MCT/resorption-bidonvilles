<template>
    <div class="flex">
        <div
            class="bg-white border-t print:hidden relative"
            :class="mapStore.filtersAreOpen ? 'w-72' : ''"
        >
            <CartographieFiltres
                @open="mapStore.filtersAreOpen = true"
                @close="mapStore.filtersAreOpen = false"
                :isOpen="mapStore.filtersAreOpen"
            />
        </div>
        <div class="flex-1" style="height: 100vh">
            <Carte
                id="carte"
                ref="carte"
                :towns="towns"
                :pois="pois"
                :isLoading="!timedOut"
                :defaultView="defaultView"
                showPrinter
                showAddressToggler
                v-model:showAddresses="mapStore.showAddresses"
                showTerritories
                showSearchbar
                @viewchange="onViewChange"
                @townclick="onTownClick"
                @poiclick="onPoiClick"
            />

            <CarteQuickviewTown
                ref="quickviewTown"
                :open="mapStore.quickview.town?.open || false"
                :town="mapStore.quickview.town?.data"
                @close="onQuickviewTownClose"
            />
            <CarteQuickviewPoi
                ref="quickviewPoi"
                :open="mapStore.quickview.poi?.open || false"
                :poi="mapStore.quickview.poi?.data"
                @close="onQuickviewPoiClose"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, nextTick } from "vue";
import { useMapStore } from "@/stores/map.store";
import { useUserStore } from "@/stores/user.store";
import { trackEvent } from "@/helpers/matomo";

import Carte from "@/components/Carte/Carte.vue";
import CarteQuickviewTown from "@/components/Carte/CarteQuickviewTown.vue";
import CarteQuickviewPoi from "@/components/Carte/CarteQuickviewPoi.vue";
import CartographieFiltres from "./CartographieFiltres.vue";
import waitForElement from "@/utils/waitForElement";

const mapStore = useMapStore();
const carte = ref(null);
const quickviewTown = ref(null);
const quickviewPoi = ref(null);
const timedOut = ref(false);

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

    return {
        center: [
            userStore.user.organization.location.latitude,
            userStore.user.organization.location.longitude,
        ],
        zoom:
            DEFAULT_ZOOMS[userStore.user.organization.location.type] ||
            DEFAULT_ZOOMS.default,
    };
});

onMounted(() => {
    waitForElement("#carte", (el) => {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    });
});

watch(mapStore.filtersAreOpen, () => {
    nextTick(carte.value.resize);
});

function onTownClick(town) {
    mapStore.quickview.poi = null;
    mapStore.quickview.town = {
        open: true,
        data: town,
    };
    quickviewTown.value.open();
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
