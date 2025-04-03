<template>
    <section class="h-full relative">
        <div class="absolute top-2 -mt-8">
            <a
                class="ml-2 text-primary text-sm hover:text-primaryDark cursor-pointer focus:ring-2 ring-offset-2 ring-info focus:outline-none"
                href="#"
                v-if="displaySkipMapLinks"
                @click.prevent="skipMap(skipFocusNext, skipPreviousLink)"
                ref="skipNextLink"
                >&Eacute;viter la carte</a
            >
        </div>
        <div id="map" class="h-full border">
            <div
                class="absolute w-full h-full top-0 left-0 z-[1001]"
                v-if="isLoading"
            >
                <div
                    class="absolute w-full h-full top-0 left-0 bg-black opacity-85"
                ></div>
                <div
                    class="flex w-full h-full items-center justify-center text-white text-3xl"
                >
                    <Spinner />
                </div>
            </div>

            <div
                ref="printer"
                class="bg-white mr-3 my-3 border-2 border-G500 py-1 px-2 rounded print:hidden !cursor-pointer"
                @click="printMapScreenshot"
                v-show="showPrinter"
            >
                <Icon icon="print" /> Imprimer la carte
            </div>

            <slot />
        </div>
        <div class="pt-1">
            <a
                class="ml-2 text-primary text-sm hover:text-primaryDark cursor-pointer focus:ring-2 ring-offset-2 ring-info focus:outline-none"
                href="#"
                v-if="displaySkipMapLinks"
                @click.prevent="skipMap(skipFocusPrevious, skipNextLink)"
                ref="skipPreviousLink"
                >&Eacute;viter la carte</a
            >
        </div>
    </section>
</template>

<style>
@import "https://unpkg.com/leaflet@1.3.4/dist/leaflet.css";
</style>

<script>
export default {
    name: "RbCarto",
};
</script>

<script setup>
import downloadBlob from "@/utils/downloadBlob";
import marqueurLocationDefault from "@/utils/marqueurLocationDefault";
import marqueurSiteDefault from "@/utils/marqueurSiteDefault";
import formatDate from "@common/utils/formatDate";
import domtoimage from "dom-to-image-more";
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/leaflet.markercluster";
import { onBeforeUnmount, onMounted, ref, toRefs, watch } from "vue";
import mapControls from "./Carte.controls";
import mapLayers from "./Carte.layers";

import { trackEvent } from "@/helpers/matomo";
import { Icon, Spinner } from "@resorptionbidonvilles/ui";

import getAbsoluteOffsetTop from "@/utils/getAbsoluteOffsetTop";
import skipFocusNext from "@/utils/skipFocusNext";
import skipFocusPrevious from "@/utils/skipFocusPrevious";
import { useNotificationStore } from "@/stores/notification.store";

const props = defineProps({
    isLoading: {
        type: Boolean,
        required: false,
        default: false,
    },
    layers: {
        type: Array,
        required: false,
        default() {
            return ["Dessin"];
        },
    },
    defaultLayer: {
        type: String,
        required: false,
    },
    showPrinter: {
        type: Boolean,
        required: false,
        default: false,
    },
    defaultView: {
        type: Object,
        required: false,
        default: () => ({
            // basically, centering on metropolitan France
            center: [46.7755829, 2.0497727],
            zoom: 6,
        }),
    },
    towns: {
        type: Array,
        required: false,
        default: () => [],
    },
    clusters: {
        type: Object,
        required: false,
        default: () => ({}),
        // un mapping de niveau de zoom avec niveau de cluster
        // les niveaux de cluster acceptés sont 'cities', 'departements', 'regions'
        // exemple:
        // {
        //     7:  'regions',
        //     11: 'departements',
        //     13: 'cities'
        // }
        // ce qui veut dire que le cluster 'regions' est activé pour les zooms <= 7,
        // le cluster 'departements' >= 8 et <= 11
        // le cluster 'cities' >= 12 et <= 13
        // et au-delà de 13, plus de clustering
    },
    townClusteringOptions: {
        type: Object,
        required: false,
        default: () => ({}),
    },
    townMarkerFn: {
        type: Function,
        required: false,
        default: (...args) => {
            return marqueurSiteDefault(...args);
        },
    },
    locationMarkerFn: {
        type: Function,
        required: false,
        default: (...args) => {
            return marqueurLocationDefault(...args);
        },
    },
    displaySkipMapLinks: {
        type: Boolean,
        required: false,
        default: false,
    },
    activeTab: {
        type: String,
        required: false,
        default: "summary",
    },
});
const {
    isLoading,
    layers,
    defaultLayer,
    showPrinter,
    defaultView,
    towns,
    clusters,
    townClusteringOptions,
    townMarkerFn,
    locationMarkerFn,
    displaySkipMapLinks,
    activeTab,
} = toRefs(props);

const map = ref(null);
const skipNextLink = ref(null);
const skipPreviousLink = ref(null);
const printer = ref(null);
const currentMarkerGroup = ref(null);

const notificationStore = useNotificationStore();
const controls = {};
const markersGroup = {
    towns: ref(L.markerClusterGroup(townClusteringOptions.value)),
    cities: ref(L.layerGroup()),
    departements: ref(L.layerGroup()),
    regions: ref(L.layerGroup()),
};
const emit = defineEmits(["townclick", "zoomend"]);

onMounted(() => {
    createMap();
    syncTownMarkers();
});

onBeforeUnmount(() => {
    if (map.value) {
        map.value.remove();
    }
});

function createMap() {
    // on crée la carte
    map.value = L.map("map", {
        layers: [mapLayers[defaultLayer.value || layers.value[0]]], // fond de carte à afficher
        scrollWheelZoom: false, // interdire le zoom via la molette de la souris
    });
    map.value.on("zoomend", onZoomEnd);

    // on initialize les contrôles
    addControl("zoom", mapControls.zoom(map.value));
    addControl("attribution", mapControls.attribution(map.value));

    if (layers.value.length > 1) {
        addControl("layers", mapControls.layers(layers.value));
    }

    if (showPrinter.value) {
        addControl("printer", mapControls.printer(printer.value));
    }

    // on configure la vue de la carte (centre, zoom, clustering, etc.)
    map.value.setView(defaultView.value.center, defaultView.value.zoom);
    map.value.on("baselayerchange", onLayerChange);
    cluster();
}

function addControl(name, control) {
    controls[name] = control;
    map.value.addControl(controls[name]);
}

function onZoomEnd(...args) {
    emit("zoomend", ...args);
    cluster();
}

function onLayerChange(...args) {
    trackEvent("Cartographie", "Changement de fond de carte", args[0].name);
}

function cluster() {
    const zoomLevel = map.value.getZoom();
    let targetMarkerGroup = "towns";

    if (Object.keys(clusters.value).length > 0) {
        Object.keys(clusters.value)
            .map((x) => parseInt(x, 10))
            .sort((a, b) => a - b)
            .some((clusterLevel) => {
                if (zoomLevel <= clusterLevel) {
                    targetMarkerGroup = clusters.value[clusterLevel];
                    return true;
                }

                return false;
            });
    }

    if (targetMarkerGroup !== currentMarkerGroup.value) {
        if (currentMarkerGroup.value) {
            map.value.removeLayer(markersGroup[currentMarkerGroup.value].value);
        }

        map.value.addLayer(markersGroup[targetMarkerGroup].value);
        currentMarkerGroup.value = targetMarkerGroup;
    }
}

async function printMapScreenshot() {
    // on masque tous les contrôles
    Object.values(controls).forEach((control) => {
        map.value.removeControl(control);
    });

    // on imprime
    const container = document.getElementById("map");

    try {
        const blob = await domtoimage.toBlob(container, {
            width: container.offsetWidth,
            height: container.offsetHeight,
            bgcolor: "#ffffff",
            filter(node) {
                // pour une raison inconnue domtoimage rajoute des bordures grises énormes
                // à tous les éléments...
                // malheureusement impossible d'empêcher ces bordures via une feuille de style,
                // il faut obligatoirement rajouter un style inline à chaque élément pour
                // dire explicitement qu'on ne veut pas de bordure dessus
                // c'est ce qu'on fait ici : si le noeud n'est pas censé avoir une bordure
                // (via classe tailwind border-quelquechose) alors on set
                // explicitement sa bordure à 0
                if (
                    node.style &&
                    !/(?:^|\s)border/gi.test(node.classList?.value)
                ) {
                    node.style.borderWidth = "0";
                }

                return true;
            },
        });
        const ts = Date.now() / 1000;
        downloadBlob(
            blob,
            `${formatDate(ts, "y-m-d")}-carte-des-bidonvilles.png`
        );

        trackEvent("Cartographie", "Impression");
    } catch (error) {
        console.log("Failed printing the map");
        notificationStore.error(
            "Erreur d'impression",
            "Erreur lors de l'impression de la carte"
        );
    }

    // on réaffiche les contrôles
    Object.values(controls).forEach((control) => {
        map.value.addControl(control);
    });
}

function syncTownMarkers() {
    // on supprime tous les précédents marqueurs
    markersGroup.towns.value.clearLayers();
    Object.values(clusters.value).map((level) =>
        markersGroup[level].value.clearLayers()
    );

    // on parse les données pour les clusters + on crée les marqueurs de site
    const territoryData = Object.values(clusters.value).reduce((acc, level) => {
        acc[level] = {};
        return acc;
    }, {});
    const keyMap = {
        cities: "city",
        departements: "departement",
        regions: "region",
    };

    markersGroup.towns.value.addLayers(
        towns.value.map((town) => {
            Object.keys(territoryData).forEach((key) => {
                const location = town[keyMap[key]];
                if (!territoryData[key][location.code]) {
                    territoryData[key][location.code] = {
                        total: 0,
                        code: location.code,
                        name: location.name,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        chieftown: location.chieftown,
                    };
                }

                territoryData[key][location.code].total += 1;
            });

            const marker = townMarkerFn.value(town, activeTab.value);
            marker.on("mouseover", () =>
                emit("highlightTownLine", town.id, town.city.code)
            );
            marker.on("mouseout", () => emit("highlightTownLine", null, null));
            marker.on("click", () => emit("townclick", town));
            return marker;
        })
    );

    // et on crée les nouveaux marqueurs de cluster
    Object.keys(territoryData).forEach((key) => {
        Object.values(territoryData[key]).forEach((data) => {
            createLocationMarker(key, data);
        });
    });
}

function createLocationMarker(level, location) {
    const marker = locationMarkerFn
        .value(level, location)
        .on("click", function () {
            const zoomLevel = Object.keys(clusters.value).find(
                (z) => clusters.value[z] === level
            );

            map.value.setView(
                location.chieftown
                    ? [
                          location.chieftown.latitude,
                          location.chieftown.longitude,
                      ]
                    : [location.latitude, location.longitude],
                parseInt(zoomLevel, 10) + 1
            );
        });

    marker.addTo(markersGroup[level].value);
}

function skipMap(skipMapFunc, el) {
    if (el && skipMapFunc(el)) {
        window.scrollTo(0, getAbsoluteOffsetTop(document.activeElement));
    }
}

watch(towns, syncTownMarkers);

defineExpose({
    addControl,
    currentMarkerGroup,
    map,
    resize() {
        if (map.value) {
            map.value.invalidateSize();
        }
    },
    setView(view) {
        map.value.setView(view.center, view.zoom || map.value.getZoom());
    },
});
</script>
