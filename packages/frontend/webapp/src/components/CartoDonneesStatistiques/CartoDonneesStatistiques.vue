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
        displaySkipMapLinks
    >
        <div
            ref="legendeConditionsDeVie"
            class="bg-white ml-3 my-3 border-2 border-G500 py-1 px-2 rounded"
        >
            <div @click="changeLegendeStatus" class="mb-2 mx-2 cursor-pointer">
                <Icon
                    :icon="`${
                        legendeStatus === true ? 'chevron-up' : 'chevron-down'
                    }`"
                />
                <label class="font-bold mx-2"> Légende </label>
            </div>
            <div v-if="legendeStatus === true" class="flex">
                <div class="flex">
                    <div class="grid grid-cols-1">
                        <label class="flex items-center space-x-2">
                            <Icon class="mx-2" icon="faucet-drip" />
                        </label>
                        <label class="flex items-center space-x-2">
                            <Icon class="mx-2" icon="bolt" />
                        </label>
                        <label class="flex items-center space-x-2">
                            <Icon class="mx-2" icon="trash-alt" />
                        </label>
                        <label class="flex items-center space-x-2">
                            <Icon class="mx-2" icon="fire-extinguisher" />
                        </label>
                        <label class="flex items-center space-x-2">
                            <Icon class="mx-2" icon="toilet" />
                        </label>
                        <label class="flex items-center space-x-2">
                            <Icon class="mx-2" icon="bug-slash" />
                        </label>
                    </div>

                    <div class="grid grid-cols-1">
                        <label> Accès à l'eau </label>
                        <label> Accès à l'électricité </label>
                        <label> Evacuation des déchets </label>
                        <label> Prévention incendie </label>
                        <label> Accès aux toilettes </label>
                        <label> Absence de nuisibles </label>
                    </div>
                </div>
                <div class="flex flex-col ml-4">
                    <div class="flex mb-2">
                        <div class="bg-success w-10 border"></div>
                        <label class="ml-2"> Satisfaisant </label>
                    </div>

                    <div class="flex mb-2">
                        <div class="bg-error w-10"></div>
                        <label class="ml-2"> A améliorer </label>
                    </div>
                    <div class="flex">
                        <div class="border w-10 crossed"></div>
                        <label class="ml-2"> Inexistant </label>
                    </div>
                </div>
            </div>
        </div>
    </Carto>
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
const legendeStatus = ref(false);

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

function changeLegendeStatus() {
    legendeStatus.value = !legendeStatus.value;
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

<style scoped>
.crossed {
    pointer-events: none;
    content: "";
    background: linear-gradient(
        to left bottom,
        transparent 49%,
        currentColor 49%,
        currentColor 51%,
        transparent 51%
    );
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
</style>
