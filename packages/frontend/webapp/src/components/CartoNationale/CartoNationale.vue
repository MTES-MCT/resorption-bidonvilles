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
    defaultView: {
        type: Object,
        required: false,
        default() {
            return {
                center: [46.7755829, 2.0497727],
                zoom: 6,
            };
        },
    },
});
const { pois, showAddresses, defaultView } = toRefs(props);
const emit = defineEmits([
    "poiclick",
    "viewchange",
    "zoomend",
    "addressVisibilityChange",
]);
const carto = ref(null);
const addressToggler = ref(null);
const initialView = ref({
    center: defaultView.value.center,
    zoom: defaultView.value.zoom,
});

let isSyncing = false;

const createPoiMarker = (poi) => {
    const marker = marqueurPoi(poi);

    marker.on("click", () => {
        emit("poiclick", poi);
    });

    marker.addTo(markersGroup.pois);
};

const syncPoiMarkers = () => {
    // Éviter les exécutions multiples
    if (isSyncing) {
        return;
    }

    isSyncing = true;

    // Ne rien faire si les POIs sont vides
    if (pois.value.length === 0) {
        markersGroup.pois.clearLayers();
        isSyncing = false;
        return;
    }

    markersGroup.pois.clearLayers();

    // Vérifier le zoom avant d'ajouter les POIs
    const currentZoom = carto.value?.map?.getZoom() || 6;

    if (currentZoom <= POI_ZOOM_LEVEL) {
        isSyncing = false;
        return;
    }

    // Filtrer les POIs avec des coordonnées
    const validPois = pois.value.filter(
        (poi) => poi?.position?.location?.coordinates
    );

    // Ajouter les marqueurs
    validPois.forEach(createPoiMarker);
    isSyncing = false;
};
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
    pois: L.layerGroup(),
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

    // Attendre un peu pour être certain que toutes les animations sont terminées
    setTimeout(() => {
        // Vérifications de sécurité
        if (!map || !map._container || map._animatingZoom) {
            return;
        }

        // Gérer les POI seulement s'il y en a à afficher
        if (pois.value.length > 0) {
            if (zoomLevel > POI_ZOOM_LEVEL) {
                // Zoom au-dessus du seuil : synchroniser les POI si nécessaire
                if (markersGroup.pois.getLayers().length === 0) {
                    syncPoiMarkers();
                }
                // S'assurer que la couche est visible
                if (!map.hasLayer(markersGroup.pois)) {
                    map.addLayer(markersGroup.pois);
                }
            } else if (map.hasLayer(markersGroup.pois)) {
                // Zoom en dessous du seuil : juste masquer la couche, PAS supprimer les marqueurs
                map.removeLayer(markersGroup.pois);
                // NE PAS nettoyer les marqueurs - ils doivent suivre la carte
            }
        }

        carto.value.addControl("addressToggler", createAddressTogglerControl());
        emit("zoomend");
    }, 100);
};

// Click sur un POI

const onMove = () => {
    const { map } = carto.value;
    const { lat, lng } = map.getCenter();
    const currentZoom = map.getZoom();

    emit("viewchange", {
        center: [lat, lng],
        zoom: currentZoom,
    });
};

const updateAddress = () => {
    markersGroup.search.clearLayers();

    if (searchAddress.value?.data?.coordinates) {
        searchMarker.addTo(markersGroup.search);
        searchMarker.setLatLng(searchAddress.value.data.coordinates);
        carto.value.map.setView(searchAddress.value.data.coordinates, 20);
        trackEvent("Cartographie", "Recherche");
    } else {
        searchMarker.remove();
        carto.value.map.setView(
            initialView.value.center,
            initialView.value.zoom
        );
    }
};

watch(
    () => carto.value,
    (newCarto) => {
        if (newCarto) {
            // Désactiver les animations de zoom problématiques
            newCarto.map.options.zoomAnimation = false;
            newCarto.map.options.markerZoomAnimation = false;

            newCarto.map.on("move", onMove);
            newCarto.map.addLayer(markersGroup.search);
        }
    }
);

// Watcher sur pois pour gérer le coché/décoché du filtre
watch(pois, (newPois, oldPois) => {
    if (carto.value) {
        if (newPois.length === 0 && oldPois.length > 0) {
            // Filtre décoché : nettoyer les marqueurs
            markersGroup.pois.clearLayers();
        } else if (newPois.length > 0 && oldPois.length === 0) {
            // Filtre coché : vérifier le zoom avant de synchroniser
            const currentZoom = carto.value?.map?.getZoom() || 6;
            if (currentZoom > POI_ZOOM_LEVEL) {
                syncPoiMarkers();
            }
        } else if (newPois.length > 0 && oldPois.length > 0) {
            // POI existent déjà : vérifier s'ils doivent être affichés
            const currentZoom = carto.value?.map?.getZoom() || 6;
            if (
                currentZoom > POI_ZOOM_LEVEL &&
                markersGroup.pois.getLayers().length === 0
            ) {
                syncPoiMarkers();
            }
        }
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
