<template>
    <Carto
        ref="carto"
        :layers="['Dessin', 'Satellite']"
        defaultLayer="Dessin"
        :townMarkerFn="marqueurSiteEau"
        :clusters="{
            7: 'regions',
            11: 'departements',
            13: 'cities',
        }"
        :class="showAddresses ? 'rb-showAddresses' : 'rb-hideAddresses'"
        showPrinter
        @zoomend="onZoomEnd"
    >
        <div class="absolute top-3 left-4 right-28 z-[1001] text-md font-sans">
            <InputAddress
                placeholder="Recherchez un lieu en saisissant une adresse"
                name="searchAddress"
                ref="searchAddress"
                id="searchAddress"
                v-model="searchAddress"
                @update:modelValue="updateAddress"
            />
        </div>

        <div
            ref="addressToggler"
            class="bg-white text-primary ml-3 my-3 border-2 border-primary py-1 px-2 print:hidden !cursor-pointer hover:!bg-primary hover:text-white"
        >
            <label class="flex items-center space-x-2 !cursor-pointer">
                <input
                    type="checkbox"
                    v-model="showAddressesModel"
                    @change="emit('addressVisibilityChange')"
                />
                <Icon
                    :icon="showAddressesModel ? 'eye' : 'eye-slash'"
                    class="p-0 !ml-0"
                />
                <span
                    >{{ showAddressesModel ? "Masquer" : "Voir" }} les adresses
                    des sites</span
                >
            </label>
        </div>
    </Carto>
</template>

<style>
.rb-map-address {
    display: none;
}

.rb-showAddresses .rb-map-address {
    display: block;
}
</style>

<script setup>
import { computed, ref, toRefs, watch } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";
import L from "leaflet";
import Carto from "@/components/Carto/Carto.vue";
import marqueurSiteEau from "@/utils/marqueurSiteEau";
import marqueurPoi from "@/utils/marqueurPoi";
import marqueurRecherche from "@/utils/marqueurRecherche";
import { trackEvent } from "@/helpers/matomo";
import InputAddress from "@/components/InputAddress/InputAddress.vue";

const searchAddressModel = ref(null);
const searchAddress = computed({
    set(value) {
        searchAddressModel.value = value;
    },
    get() {
        return searchAddressModel.value;
    },
});

const props = defineProps({
    pois: {
        type: Array,
        required: false,
        default() {
            return [];
        },
    },
    showAddresses: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const { pois, showAddresses } = toRefs(props);
const emit = defineEmits([
    "poiclick",
    "viewchange",
    "zoomend",
    "addressVisibilityChange",
]);
const carto = ref(null);
const addressToggler = ref(null);
const showAddressesModel = computed({
    get() {
        return showAddresses.value;
    },
    set(value) {
        emit("update:showAddresses", value);
    },
});

const POI_ZOOM_LEVEL = 13;
const markersGroup = {
    pois: L.markerClusterGroup({
        disableClusteringAtZoom: POI_ZOOM_LEVEL,
    }),
    search: L.layerGroup(),
};
const searchMarker = marqueurRecherche();

const createAddressTogglerControl = () => {
    const AddressToggler = L.Control.extend({
        options: {
            position: "bottomleft",
        },

        onAdd() {
            return addressToggler.value;
        },
    });

    return new AddressToggler();
};

const onZoomEnd = () => {
    const { map } = carto.value;
    const zoomLevel = map.getZoom();

    if (zoomLevel > POI_ZOOM_LEVEL) {
        const poiIsVisible = map.hasLayer(markersGroup.pois);
        if (!poiIsVisible) {
            map.addLayer(markersGroup.pois);
        }
    } else if (map.hasLayer(markersGroup.pois)) {
        map.removeLayer(markersGroup.pois);
    }

    carto.value.addControl("addressToggler", createAddressTogglerControl());
    emit("zoomend");
};

const createPoiMarker = (poi) => {
    const marker = marqueurPoi(poi);
    marker.on("click", () => {
        emit("poiclick", poi);
    });

    marker.addTo(markersGroup.pois);
};

const syncPoiMarkers = () => {
    markersGroup.pois.clearLayers();

    // sans le timeout, les nouveaux marqueurs n'apparaissent jamais :/
    setTimeout(() => {
        pois.value.forEach(createPoiMarker);
    }, 1000);
};

const onMove = () => {
    const { map } = carto.value;
    const { lat: latitude, lng: longitude } = map.getCenter();
    emit("viewchange", {
        center: [latitude, longitude],
        zoom: map.getZoom(),
    });
};

const updateAddress = () => {
    markersGroup.search.clearLayers();

    if (searchAddress.value?.data?.coordinates) {
        searchMarker.addTo(markersGroup.search);
        searchMarker.setLatLng(searchAddress.value.data.coordinates);
        carto.value.map.setView(searchAddress.value.data.coordinates, 20);
        trackEvent("Cartographie", "Recherche");
    }
};

watch(pois, syncPoiMarkers);
watch(carto, () => {
    if (carto.value) {
        carto.value.map.on("move", onMove);
        carto.value.map.addLayer(markersGroup.search);
    }
});

defineExpose({
    resize(...args) {
        if (carto.value) {
            return carto.value.resize(...args);
        }

        return null;
    },
});
</script>
