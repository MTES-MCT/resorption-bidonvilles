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
        :activeTab="activeTab"
        displaySkipMapLinks
    >
        <div
            ref="legende"
            class="bg-white ml-3 my-3 border-2 border-G500 py-1 px-2 rounded"
        >
            <div
                @click="changeLegendeStatus"
                class="flex mb-2 mx-2 cursor-pointer"
            >
                <Icon
                    :icon="`${
                        legendeStatus === true ? 'chevron-down' : 'chevron-up'
                    }`"
                />
                <div class="font-bold mx-2">Légende</div>
            </div>
            <div v-if="legendeStatus === true" class="flex">
                <div class="flex">
                    <div class="grid grid-cols-1 content-start">
                        <div
                            class=""
                            v-for="displayedLegendItem in displayedLegend[
                                activeTab
                            ].icons"
                            :key="displayedLegendItem"
                        >
                            <Icon class="mx-2" :icon="displayedLegendItem" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 content-start">
                        <div
                            v-for="displayedLegendLabel in displayedLegend[
                                activeTab
                            ].labels"
                            :key="displayedLegendLabel"
                        >
                            {{ displayedLegendLabel }}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col ml-4">
                    <div v-if="displayedLegend[activeTab].levelsTitle">
                        <div class="font-bold">
                            {{ displayedLegend[activeTab].levelsTitle }}
                        </div>
                    </div>
                    <div
                        class="flex mb-2"
                        v-for="level in displayedLegend[activeTab].levels"
                        :key="level.label"
                    >
                        <div :class="`${level.style}`"></div>
                        <div class="ml-2">{{ level.label }}</div>
                    </div>
                </div>
            </div>
        </div>
    </Carto>
</template>

<script setup>
import { computed, ref, toRefs, watch } from "vue";
import L from "leaflet";
import Carto from "@/components/Carto/Carto.vue";
import marqueurSiteStats from "@/utils/marqueurSiteStats";
import marqueurLocationStats from "@/utils/marqueurLocationStats";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    activeTab: {
        type: String,
        default: "summary",
        required: false,
    },
});
const { activeTab } = toRefs(props);

const departementMetricsStore = useDepartementMetricsStore();
const carto = ref(null);
const markersGroup = ref(L.geoJSON([], {}));
const legende = ref(null);
const legendeStatus = ref(false);

watch(carto, () => {
    if (carto.value) {
        carto.value.map.addLayer(markersGroup.value);
        carto.value.map.on("move", onMove);
        carto.value.addControl("legende", createLegende());
    }
});

const displayedLegend = {
    livingConditionsByTown: null,
    livingConditionsByInhabitant: null,
    summary: {
        icons: [
            "faucet-drip",
            "bolt",
            "trash-alt",
            "fire-extinguisher",
            "toilet",
            "bug-slash",
        ],
        labels: [
            "Accès à l'eau",
            "Accès à l'électricité",
            "Evacuation des déchets",
            "Prévention incendie",
            "Accès aux toilettes",
            "Absence de nuisibles",
        ],
        levelsTitle: null,
        levels: [
            { style: "bg-success w-10 border", label: "Satisfaisant" },
            { style: "bg-error w-10", label: "A améliorer" },
            { style: "border w-10 crossed", label: "Inexistant" },
        ],
    },
    schooling: {
        icons: ["child", "school"],
        labels: ["Mineurs", "Mineurs scolarisés"],
        levelsTitle: "Pourcentage de scolarisation",
        levels: [
            { style: "bg-success w-10 border", label: ">= 70 %" },
            { style: "bg-warningOrange w-10", label: ">= 30 %" },
            { style: "bg-error w-10", label: "< 30 %" },
            { style: "bg-G400 w-10 border", label: "Pas de mineurs" },
        ],
    },
};
// Pas de différence entre summary et livingConditions (temporaire)
displayedLegend.livingConditionsByTown = displayedLegend.summary;
displayedLegend.livingConditionsByInhabitant = displayedLegend.summary;

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
            return legende.value;
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
