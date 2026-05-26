<template>
    <Carto
        ref="carto"
        :mapId="mapId"
        :defaultView="defaultView"
        :layers="['Dessin', 'Satellite']"
        defaultLayer="Satellite"
        displaySkipMapLinks
    />
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import L from "leaflet";
import Carto from "@/components/Carto/Carto.vue";

const props = defineProps({
    mapId: {
        type: String,
        default: "carto-fiche-action",
    },
    defaultView: {
        type: Object,
        required: true,
    },
    towns: {
        type: Array,
        default: () => [],
    },
});

const { towns, defaultView } = toRefs(props);
const carto = ref(null);
const markersLayer = L.layerGroup();

watch(
    () => carto.value?.map,
    (map) => {
        if (!map) {
            return;
        }

        markersLayer.addTo(map);
        updateMarkers();
    }
);

watch(
    towns,
    () => {
        updateMarkers();
    },
    { deep: true }
);

function updateMarkers() {
    if (!carto.value?.map) {
        return;
    }

    markersLayer.clearLayers();

    if (!towns.value || towns.value.length === 0) {
        return;
    }

    const markers = [];

    towns.value.forEach((town) => {
        const marker = L.marker([town.latitude, town.longitude]);
        marker.addTo(markersLayer);
        markers.push(marker);
    });

    // Ajuster automatiquement la vue pour afficher tous les marqueurs
    if (markers.length > 1) {
        const group = L.featureGroup(markers);
        carto.value.map.fitBounds(group.getBounds(), {
            padding: [50, 50],
        });
    }
}
</script>
