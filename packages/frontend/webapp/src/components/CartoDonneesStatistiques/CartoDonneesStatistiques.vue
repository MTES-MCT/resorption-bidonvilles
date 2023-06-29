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
    />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import L from "leaflet";
import Carto from "@/components/Carto/Carto.vue";
import marqueurSiteStats from "@/utils/marqueurSiteStats";
import marqueurLocationStats from "@/utils/marqueurLocationStats";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";

const departementMetricsStore = useDepartementMetricsStore();
const carto = ref(null);
const markersGroup = ref(L.geoJSON([], {}));

watch(carto, () => {
    if (carto.value) {
        carto.value.map.addLayer(markersGroup.value);
        carto.value.map.on("move", onMove);
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

defineExpose({
    currentMarkerGroup: computed(() => {
        return carto.value?.currentMarkerGroup;
    }),
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
