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
    />
</template>

<script setup>
import { ref, watch } from "vue";
import L from "leaflet";
import Carto from "@/components/Carto/Carto.vue";
import marqueurSiteStats from "@/utils/marqueurSiteStats";
import marqueurLocationStats from "@/utils/marqueurLocationStats";

const carto = ref(null);
const markersGroup = ref(L.geoJSON([], {}));

watch(carto, () => {
    if (carto.value) {
        carto.value.map.addLayer(markersGroup.value);
    }
});

defineExpose({
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
        carto.value.map.setMaxBounds(bounds);
        return carto.value.map.fitBounds(bounds);
    },
});
</script>
