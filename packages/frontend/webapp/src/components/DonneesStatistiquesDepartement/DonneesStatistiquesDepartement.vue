<template>
    <Title class="mt-6">{{ departement.name }} ({{ departement.code }})</Title>
    <DonneesStatistiquesDepartementBigFigures :metrics="metrics" />
    <FiltrageTemporel class="mt-5" v-model="dateRange" />
    <PeriodePersonnalisee v-if="dateRange === 'periode-personnalisee'" />

    <main class="mt-2">
        <Onglets
            :tabs="userTabs"
            :activeTab="departementMetricsStore.currentFormat"
        />
        <section
            class="mt-0"
            v-if="departementMetricsStore.currentFormat === 'summary'"
        >
            <EvolutionCharts :dateRange="dateRange" />
        </section>
        <div v-else class="mt-6 flex justify-evenly items-stretch">
            <div
                :class="{
                    'flex-1 pr-6': mapSize !== 'full',
                    'w-0 h-0 overflow-hidden': mapSize === 'full',
                }"
            >
                <component
                    :is="currentTable"
                    :metrics="metrics"
                    @highlightTown="onMouseEnter"
                    @unhighlightTown="onMouseLeave"
                    @townClick="onTownRowClick"
                    @townZoom="onTownRowZoom"
                    :highlightedTown="highlightedTown"
                />
            </div>
            <div class="w-1 bg-blue300">
                <div class="sticky top-0 z-[1001]">
                    <div
                        class="absolute top-0 left-0 w-4 -ml-2 z-[3000] text-primary font-bold text-center text-xs bg-blue300 rounded-lg"
                    >
                        <div
                            class="rounded-t-lg py-2"
                            :class="
                                mapSize !== 'full'
                                    ? 'cursor-pointer hover:bg-blue200'
                                    : 'text-blue400'
                            "
                            @click="increaseMapSize"
                        >
                            <Icon icon="chevron-left" />
                        </div>
                        <div class="h-px bg-primary w-3 mx-auto"></div>
                        <div
                            class="rounded-b-lg py-2"
                            :class="
                                mapSize !== 'hidden'
                                    ? 'cursor-pointer hover:bg-blue200'
                                    : 'text-blue400'
                            "
                            @click="decreaseMapSize"
                        >
                            <Icon icon="chevron-right" />
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="sticky top-0"
                :class="{
                    'w-0 overflow-hidden': mapSize === 'hidden',
                    'w-1/3': mapSize === 'half',
                    'flex-1': mapSize === 'full',
                    'h-screen': mapSize === 'half' || mapSize === 'full',
                }"
            >
                <CartoDonneesStatistiques
                    ref="carte"
                    :isLoading="isLoading"
                    :towns="towns"
                    @townclick="onTownClick"
                    @highlightTownLine="toggleTownHighlight"
                    :activeTab="departementMetricsStore.activeTab"
                />
            </div>
        </div>
    </main>
</template>

<style lang="scss">
.marqueur-site-highlighted {
    z-index: 1000;
}

.marqueur-site-highlighted span {
    @apply border-secondary;
}

.marqueur-location-highlighted {
    z-index: 1000;
}

.marqueur-location-highlighted span {
    @apply bg-secondary;
}
</style>

<script setup>
import { computed, nextTick, onMounted, toRefs, ref, watch } from "vue";
import { useGeojsonStore } from "@/stores/geojson.store";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { useUserStore } from "@/stores/user.store";
import router from "@/helpers/router";
import tabs from "./DonneesStatistiquesDepartement.tabs";
import { trackEvent } from "@/helpers/matomo";

import { Icon } from "@resorptionbidonvilles/ui";
import Title from "../DonneesStatistiques/Title.vue";
import Onglets from "../DonneesStatistiques/DonneesStatistiquesDepartementOnglets.vue";
import CartoDonneesStatistiques from "@/components/CartoDonneesStatistiques/CartoDonneesStatistiques.vue";
import SummaryTable from "./components/tables/SummaryTable.vue";
import InhabitantsTable from "./components/tables/InhabitantsTable.vue";
import LivingConditionsByInhabitantTable from "./components/tables/LivingConditionsByInhabitantTable.vue";
import LivingConditionsByTownTable from "./components/tables/LivingConditionsByTownTable.vue";
import SchoolingTable from "./components/tables/SchoolingTable.vue";
import JusticeTable from "./components/tables/JusticeTable.vue";
import EvolutionCharts from "./components/chartTabs/EvolutionCharts.vue";
import DonneesStatistiquesDepartementBigFigures from "./components/header/DonneesStatistiquesDepartementBigFigures.vue";
import FiltrageTemporel from "./components/header/FiltrageTemporel.vue";
import PeriodePersonnalisee from "./components/header/PeriodePersonnalisee.vue";

const props = defineProps({
    departement: {
        type: Object,
        required: true,
    },
    metrics: {
        type: Object,
        required: true,
    },
});
const { departement, metrics } = toRefs(props);
const departementMetricsStore = useDepartementMetricsStore();
const userStore = useUserStore();

const carte = ref(null);
const isLoading = ref(true);
const mapSize = ref("half");
const dateRange = ref("2-annees-ecoulees");
const tables = {
    summary: SummaryTable,
    inhabitants: InhabitantsTable,
    livingConditionsByInhabitant: LivingConditionsByInhabitantTable,
    livingConditionsByTown: LivingConditionsByTownTable,
    schooling: SchoolingTable,
    justice: JusticeTable,
};
const highlightedTown = ref(null);

const userTabs = computed(() => {
    if (!userStore.hasJusticePermission) {
        return tabs.filter((t) => t.id !== "justice");
    }
    return tabs;
});

const currentTable = computed(() => {
    return tables[departementMetricsStore.activeTab];
});

const towns = computed(() => {
    return metrics.value.cities
        .map(({ city, towns }) =>
            towns.map((t) => ({
                ...t,
                city,
                departement: metrics.value.departement,
                region: metrics.value.region,
            }))
        )
        .flat();
});

async function loadGeojson() {
    isLoading.value = true;

    const geojsonStore = useGeojsonStore();
    try {
        const geojson = await geojsonStore.getDepartement(
            departement.value.code
        );

        if (currentFormat.value === "table") {
            carte.value.setBounds(geojson, {
                color: "#00006D",
                weight: "1",
                fill: true,
                fillColor: "#00006D",
                fillOpacity: 0.05,
            });
        }
    } catch (error) {
        console.error(error);
    }

    isLoading.value = false;
}

function increaseMapSize() {
    if (mapSize.value === "hidden") {
        mapSize.value = "half";
    } else if (mapSize.value === "half") {
        mapSize.value = "full";
    }
    trackEvent(
        "Visualisation des données départementales",
        "Agrandissement carte"
    );

    nextTick(carte.value.resize);
}

function decreaseMapSize() {
    if (mapSize.value === "full") {
        mapSize.value = "half";
    } else if (mapSize.value === "half") {
        mapSize.value = "hidden";
    }
    trackEvent("Visualisation des données départementales", "Réduction carte");

    nextTick(carte.value.resize);
}

let highlightedEl = {
    dom: null,
    originalZIndex: null,
};
function onMouseEnter(townId, cityCode) {
    // on essaie de récupérer le marqueur site
    let highlightClass = "marqueur-site-highlighted";
    highlightedEl.dom = document.getElementById(
        `marqueur-site-stats-${townId}`
    )?.parentNode;
    if (!highlightedEl.dom) {
        highlightClass = "marqueur-location-highlighted";
        highlightedEl.dom = document.getElementById(
            `marqueur-cities-stats-${cityCode}`
        )?.parentNode;
    }

    if (!highlightedEl.dom) {
        return;
    }

    highlightedEl.originalZIndex = highlightedEl.dom.style.zIndex;
    highlightedEl.dom.classList.add(highlightClass);
    highlightedEl.dom.style.removeProperty("z-index");
}

function onMouseLeave() {
    if (!highlightedEl.dom) {
        return;
    }

    highlightedEl.dom.classList.remove(
        "marqueur-site-highlighted",
        "marqueur-location-highlighted"
    );
    highlightedEl.dom.style.zIndex = highlightedEl.originalZIndex;
    highlightedEl.dom = null;
}

function onTownRowClick(town) {
    router.push(`/site/${town.id}`);
}

function onTownRowZoom(town) {
    carte.value.setView({
        center: [town.latitude, town.longitude],
        zoom: 13,
    });
}

function onTownClick(town) {
    router.push(`/site/${town.id}`);
}

const { currentFormat } = toRefs(departementMetricsStore);

const toggleTownHighlight = (townId, cityCode) => {
    highlightedTown.value = townId;
    if (townId === null) {
        onMouseLeave();
    } else if (highlightedTown.value === townId) {
        onMouseEnter(townId, cityCode);
    } else {
        onMouseEnter(townId, cityCode);
    }
};
watch(currentFormat, () => {
    loadGeojson();
});

watch(departement, loadGeojson);
onMounted(loadGeojson);
</script>
