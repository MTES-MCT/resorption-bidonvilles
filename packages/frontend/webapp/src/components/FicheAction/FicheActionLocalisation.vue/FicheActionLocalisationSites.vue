<template>
    <section class="grid grrid-cols-1 lg:grid-cols-2 gap-4">
        <article
            v-for="shantytown in paginatedShantytowns"
            :key="shantytown.id"
        >
            <DsfrTile
                :title="shantytown.fieldType.label"
                :description="`${shantytown.usename}, ${shantytown.city.name}`"
                :icon="false"
                :imgSrc="getShantytownSvgPath(shantytown.fieldType)"
                :horizontal="true"
                small
                :to="`/site/${shantytown.id}`"
            />
        </article>
    </section>
    <div class="flex justify-center pt-6 -mb-4 w-full">
        <DsfrPagination
            v-if="totalPages > 1"
            v-model:current-page="currentPageIndex"
            :pages="pages"
            :truncLimit="trunkLimit"
        />
    </div>
</template>

<script setup>
import { toRefs, computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useConfigStore } from "@/stores/config.store";
import enrichShantytown from "@/utils/enrichShantytown";
import svgMap from "@gouvfr/dsfr/dist/artwork/pictograms/map/map.svg?url";
import svgCompass from "@gouvfr/dsfr/dist/artwork/pictograms/map/compass.svg?url";
import svgMapPin from "@gouvfr/dsfr/dist/artwork/pictograms/map/map-pin.svg?url";
import svgBuilding from "@gouvfr/dsfr/dist/artwork/pictograms/buildings/companie.svg?url";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const configStore = useConfigStore();
const itemsPerPage = 4;

// Gestion du resize / responsivness
const viewportWidth = ref(window.innerWidth);
const onResize = () => {
    viewportWidth.value = window.innerWidth;
};
onMounted(() => {
    window.addEventListener("resize", onResize);
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
});

const getTrunkLimit = () => {
    if (viewportWidth.value < 520) {
        return 1;
    }
    if (viewportWidth.value < 1024) {
        return 3;
    }
    return 5;
};

const trunkLimit = computed(() => getTrunkLimit());

// Conversion entre index 1-based (action) et 0-based (DsfrPagination)
const currentPageIndex = computed({
    get: () => (action.value.location_shantytowns_page || 1) - 1,
    set: (value) => {
        action.value.location_shantytowns_page = value + 1;
    },
});
const totalPages = computed(() => {
    return Math.ceil(action.value.location_shantytowns?.length / itemsPerPage);
});
const pages = computed(() => {
    const results = [];

    for (let i = 1; i <= totalPages.value; i++) {
        results.push({
            title: `${i}`,
            href: `${i}`,
            label: i,
        });
    }

    return results;
});

const shantytowns = computed(() => {
    if (!Array.isArray(action.value.location_shantytowns)) {
        return [];
    }

    return action.value.location_shantytowns.map((shantytown) =>
        enrichShantytown(shantytown, configStore.config?.field_types || [])
    );
});

const paginatedShantytowns = computed(() => {
    const startIndex = currentPageIndex.value * itemsPerPage;
    return shantytowns.value.slice(startIndex, startIndex + itemsPerPage);
});

// Gestion des SVG des types de terrains
const svgByFieldTypeId = {
    1: svgMapPin,
    2: svgBuilding,
    3: svgMap,
};

const getShantytownSvgPath = (fieldType = {}) => {
    if (fieldType.id && svgByFieldTypeId[fieldType.id]) {
        return svgByFieldTypeId[fieldType.id];
    }

    const normalizedLabel = (fieldType.label || "")
        .toString()
        .trim()
        .toLowerCase();

    if (normalizedLabel.includes("terrain")) {
        return svgMap;
    }

    if (normalizedLabel.includes("autre")) {
        return svgMapPin;
    }

    return svgCompass;
};
</script>
