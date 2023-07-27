<template>
    <Carto
        ref="carto"
        :layers="['Light']"
        :clusters="{
            7: 'departements',
            10: 'cities',
        }"
        :townMarkerFn="marqueurSiteStats"
        :locationMarkerFn="marqueurLocationStats"
        :townClusteringOptions="{ maxClusterRadius: 0 }"
        :defaultView="departementMetricsStore.lastMapView || undefined"
    >
        <div
            ref="legendeConditionsDeVie"
            class="bg-white ml-3 my-3 border-2 border-G500 py-1 px-2 rounded"
        >
            <label class="flex items-center space-x-2">
                <Icon class="text-success mx-2" icon="faucet-drip" />
                Accès satisfaisant
            </label>
            <label class="flex items-center space-x-2">
                <Icon class="text-error mx-2" icon="faucet-drip" />
                Accès à améliorer
            </label>
        </div></Carto
    >
</template>

<script setup>
import { computed, ref, watch } from "vue";
import L from "leaflet";
import Carto from "@/components/Carto/Carto.vue";
import marqueurSiteStats from "@/utils/marqueurSiteStats";
import marqueurLocationStats from "@/utils/marqueurLocationStats";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";

import { Icon } from "@resorptionbidonvilles/ui";
const departementMetricsStore = useDepartementMetricsStore();
const carto = ref(null);
const markersGroup = ref(L.geoJSON([], {}));
const legendeConditionsDeVie = ref(null);

watch(carto, () => {
    if (carto.value) {
        carto.value.map.addLayer(markersGroup.value);
        carto.value.map.on("move", onMove);
        carto.value.addControl("legendeConditionsDeVie", createLegende());
    }
});

function onMove() {
    const { map } = carto.value;
    const { lat: latitude, lng: longitude } = map.getCenter();
    departementMetricsStore.lastMapView = {
        center: [latitude, longitude],
        zoom: map.getZoom(),
    };
}

function createLegende() {
    const Legende = L.Control.extend({
        options: {
            position: "bottomleft",
        },

        onAdd() {
            return legendeConditionsDeVie.value;
        },
    });

    return new Legende();
}

defineExpose({
    currentMarkerGroup: computed(() => {
        return carto.value?.currentMarkerGroup;
    }),
    setView(...args) {
        if (carto.value) {
            return carto.value.setView(...args);
        }

        return null;
    },
    resize(...args) {
        if (carto.value) {
            return carto.value.resize(...args);
        }

        return null;
    },
    setBounds(geojson, style = {}) {
        markersGroup.value.clearLayers();
        markersGroup.value.addData(geojson);

        if (style) {
            markersGroup.value.setStyle(style);
        }

        const bounds = L.geoJSON(geojson).getBounds();
        if (!departementMetricsStore.lastMapView) {
            carto.value.map.fitBounds(bounds);
        }
    },
});
</script>
