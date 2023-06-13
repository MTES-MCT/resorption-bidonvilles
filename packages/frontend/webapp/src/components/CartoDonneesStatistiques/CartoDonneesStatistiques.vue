<template>
    <Carto
        ref="carto"
        :layers="['Light']"
        :clusters="{
            7: 'departements',
            13: 'cities',
        }"
        showPrinter
    />
</template>

<script setup>
import { ref, watch } from "vue";
import L from "leaflet";
import Carto from "@/components/Carto/Carto.vue";

const carto = ref(null);
const markersGroup = ref(L.geoJSON([], {}));

watch(carto, () => {
    if (carto.value) {
        carto.value.map.addLayer(markersGroup.value);
    }
});

defineExpose({
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
