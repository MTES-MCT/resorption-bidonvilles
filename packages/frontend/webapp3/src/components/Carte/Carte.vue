<template>
    <section class="h-full relative" :class="showAddresses ? 'rb-showAddresses' : 'rb-hideAddresses'">
        <div v-if="showSearchbar" class="absolute top-3 left-4 right-28 z-[1001]">
            <InputAddress :placeholder="placeholder" v-model="address" />
        </div>

        <div id="map" class="h-full border">
            <div class="absolute w-full h-full top-0 left-0 z-[1001]" v-if="isLoading || disabled">
                <div class="absolute w-full h-full top-0 left-0 bg-black opacity-50"></div>
                <div class="flex w-full h-full items-center justify-center text-white text-3xl">
                    <Spinner />
                </div>
            </div>

            <div ref="cadastreToggler" class="bg-white ml-3 my-3 border-2 border-G500 py-1 px-2 rounded print:hidden"
                v-show="cadastre">
                <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="showCadastre" />
                    <span>Voir le cadastre</span>
                </label>
            </div>

            <div ref="addressToggler" class="bg-white ml-3 my-3 border-2 border-G500 py-1 px-2 rounded print:hidden"
                v-show="showAddressToggler">
                <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="showAddressesModel" />
                    <span>Voir les adresses des sites</span>
                </label>
            </div>

            <div ref="fieldTypes" class="bg-white mr-3 my-3 border-2 border-G500 py-1 px-2 rounded" v-show="showLegend">
                <h1 class="text-md mb-2">Légende</h1>
                <p class="flex items-center space-x-2" v-for="fieldType in configStore.config.field_types"
                    :key="fieldType.label">
                    <span class="my-1 inline-block w-4 h-4 rounded" v-bind:style="{
                        'background-color': fieldType.color,
                    }"></span>
                    <span>{{ fieldType.label }}</span>
                </p>
            </div>

            <div ref="printer"
                class="bg-white mr-3 my-3 border-2 border-G500 py-1 px-2 rounded print:hidden cursor-pointer"
                @click="printMapScreenshot" v-show="showPrinter">
                <Icon icon="print" /> Imprimer la carte
            </div>
        </div>
    </section>
</template>

<style>
@import "https://unpkg.com/leaflet@1.3.4/dist/leaflet.css";

.rb-map-address {
    display: none;
}

.rb-showAddresses .rb-map-address {
    display: block;
}
</style>

<script setup>
import {
    ref,
    computed,
    defineProps,
    toRefs,
    onMounted,
    onBeforeUnmount,
    watch,
    defineEmits,
} from "vue";
import L from "leaflet";
import domtoimage from "dom-to-image-more";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster";
import { useConfigStore } from "@/stores/config.store";
import { useNotificationStore } from "@/stores/notification.store";
import mapLayers from "./Carte.layers";
import mapControls from "./Carte.controls";
import { trackEvent } from "@/helpers/matomo";
import downloadBlob from "@/utils/downloadBlob";
import formatDate from "@/utils/formatDate";
import copyToClipboard from "@/utils/copyToClipboard";

// données tirées de https://github.com/gregoiredavid/france-geojson
// import departements from "@/assets/geojson/departements.json";
// import regions from "@/assets/geojson/regions.json";
import waterYes from "@/assets/img/map/water-yes.png";
import waterNo from "@/assets/img/map/water-no.png";
import waterToImprove from "@/assets/img/map/water-to-improve.png";
import waterNull from "@/assets/img/map/water-null.png";
import cutlery from "@/assets/img/map/cutlery.png";
import defaultMarker from "@/assets/img/map/marker.png";

import { Icon, Spinner } from "@resorptionbidonvilles/ui";
import InputAddress from "@/components/InputAddress/InputAddress.vue";

const REGION_MAX_ZOOM_LEVEL = 7;
const DEPT_MAX_ZOOM_LEVEL = 11;
const CITY_MAX_ZOOM_LEVEL = 13;
const POI_ZOOM_LEVEL = 13;

const props = defineProps({
    isLoading: {
        type: Boolean,
        required: false,
        default: false,
    },
    defaultLayer: {
        type: String,
        required: false,
        default: "Dessin",
    },
    showSearchbar: {
        type: Boolean,
        required: false,
        default: false,
    },
    showPrinter: {
        type: Boolean,
        required: false,
        default: false,
    },
    showAddressToggler: {
        type: Boolean,
        required: false,
        default: false,
    },
    showAddresses: {
        type: Boolean,
        required: false,
        default: false,
    },
    showLegend: {
        type: Boolean,
        required: false,
        default: false,
    },
    showTerritories: {
        type: Boolean,
        required: false,
        default: false,
    },
    defaultView: {
        type: Object,
        required: false,
        default: () => ({
            // basically, centering on France
            center: [46.7755829, 2.0497727],
            zoom: 6,
        }),
    },
    towns: {
        type: Array,
        required: false,
        default: () => [],
    },
    pois: {
        type: Array,
        required: false,
        default() {
            return [];
        },
    },
    cadastre: {
        type: Object,
        required: false,
        default: null,
    },
    placeholder: {
        type: String,
        required: false,
        default: "Recherchez un lieu en saisissant une adresse",
    },
    withInput: {
        type: Boolean,
        required: false,
        default: false,
    },
    modelValue: {
        type: Array,
        required: false,
        default() {
            return [46.7755829, 2.0497727];
        },
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const {
    isLoading,
    showPrinter,
    showSearchbar,
    showAddressToggler,
    showAddresses,
    showLegend,
    showTerritories,
    defaultView,
    towns,
    pois,
    cadastre,
    withInput,
    modelValue,
    disabled,
} = toRefs(props);
const configStore = useConfigStore();
const notificationStore = useNotificationStore();

const map = ref(null);
const controls = {};
const printer = ref(null);
const cadastreToggler = ref(null);
const addressToggler = ref(null);
const fieldTypes = ref(null);
const fieldTypeColors = computed(() => {
    return configStore.config.field_types.reduce((acc, fieldType) => {
        acc[fieldType.id] = fieldType.color;
        return acc;
    }, {});
});
const waterImages = {
    unknown: waterNull,
    [undefined]: waterNull,
    good: waterYes,
    bad: waterNo,
    toImprove: waterToImprove,
};
const showAddressesModel = computed({
    get() {
        return showAddresses.value;
    },
    set(value) {
        emit("update:showAddresses", value);
    },
});
const showCadastre = ref(false);
const address = ref(null);
const inputMarker = L.marker(modelValue.value, {
    draggable: true,
    icon: L.icon({
        iconUrl: defaultMarker,
        iconSize: [30, 30],
        iconAnchor: [15, 28],
    }),
});
const searchMarker = L.marker([46.7755829, 2.0497727], {
    title: "Recherche",
    icon: L.divIcon({
        className: "my-marker",
        html: `<div class="w-6 relative">
            <div
                class="bg-white rounded-full w-6 h-6 border-2 flex items-center justify-center"
                style="border: 3px solid #ff0000"
                ></div>
            <div
                class="-mt-[1px] w-3 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 m-auto"
                style="border-top-color: #ff0000"
            ></div>
        </div>`,
        iconAnchor: [13, 28],
    }),
});
const defaultLayer = computed(() => {
    return mapLayers[props.defaultLayer];
});
const layersControl = ref(null);
const currentMarkerGroup = ref(null);
// const markersGroupData = {
//     departements,
//     regions,
// };
const markersGroup = {
    towns: ref(L.markerClusterGroup({})),
    cities: ref(L.layerGroup()),
    departements: showTerritories.value
        ? ref(
            L.geoJSON(/*markersGroupData.departements*/[], {
                style: { color: "#6A6A6A", weight: 1 },
            })
        )
        : null,
    regions: showTerritories.value
        ? ref(
            L.geoJSON(/**markersGroupData.regions**/[], {
                style: { color: "#6A6A6A", weight: 1 },
            })
        )
        : null,
    search: ref(L.layerGroup()),
    pois: ref(
        L.markerClusterGroup({
            disableClusteringAtZoom: POI_ZOOM_LEVEL,
        })
    ),
    cadastre: ref(
        L.geoJSON([], {
            onEachFeature: handleParcelle,
        })
    ),
};

const emit = defineEmits([
    "viewchange",
    "townclick",
    "poiclick",
    "update:showAddresses",
    "update:modelValue",
]);
onMounted(() => {
    createMap();
    syncTownMarkers();
});

onBeforeUnmount(() => {
    if (map.value) {
        map.value.remove();
    }
});

let clickTimeout = null;
function handleClick({ latlng: { lat, lng } }) {
    refreshInput([lat, lng]);
    clearTimeout(clickTimeout);
    clickTimeout = null;
}

function refreshInput(center, emitInput = true) {
    if (disabled.value === true) {
        return;
    }

    inputMarker.setLatLng(center);
    map.value.setView(center, map.value.getZoom());

    if (emitInput === true) {
        emit("update:modelValue", center);
    }
}

function createMap() {
    map.value = L.map("map", {
        layers: [defaultLayer.value], // fond de carte à afficher
        scrollWheelZoom: false, // interdire le zoom via la molette de la souris
    });
    map.value.on("zoomend", onZoomEnd);
    map.value.on("move", onMove);
    map.value.addLayer(markersGroup.search.value);

    if (withInput.value === true) {
        inputMarker.addTo(map.value);
        inputMarker.addEventListener("dragend", () => {
            const { lat, lng } = inputMarker.getLatLng();
            refreshInput([lat, lng]);
        });

        map.value.on("click", (event) => {
            clearTimeout(clickTimeout);
            clickTimeout = setTimeout(handleClick.bind(this, event), 200);
        });
        map.value.on("dblclick", () => {
            clearTimeout(clickTimeout);
            clickTimeout = null;
        });
    }

    setupMapControls();
    setupView();
    onZoomEnd();
}

function setupMapControls() {
    mapControls.attribution(map.value);
    mapControls.zoom(map.value);
    controls.zoom = map.value.zoomControl;
    controls.layers = addLayersControl();
    controls.scale = mapControls.scale(map.value);
    controls.printer = mapControls.printer(map.value, printer.value);
    controls.cadastreToggler = mapControls.cadastreToggler(
        map.value,
        cadastreToggler.value
    );
    controls.addressToggler = mapControls.addressToggler(
        map.value,
        addressToggler.value
    );
    controls.fieldTypes = mapControls.fieldTypes(map.value, fieldTypes.value);
}

function removeControls() {
    Object.values(controls).forEach((control) => {
        map.value.removeControl(control);
    });
}

function restoreControls() {
    Object.values(controls).forEach((control) => {
        map.value.addControl(control);
    });
}

function addLayersControl() {
    if (!layersControl.value) {
        layersControl.value = mapControls.layers();
    }

    if (!layersControl.value._map) {
        map.value.addControl(layersControl.value);
    }

    return layersControl.value;
}

function setupView() {
    centerMap(defaultView.value.center, defaultView.value.zoom);
}

function centerMap(coordinates, zoom) {
    map.value.setView(coordinates, zoom);
}

function onMove() {
    const { lat: latitude, lng: longitude } = map.value.getCenter();
    emit("viewchange", {
        center: [latitude, longitude],
        zoom: map.value.getZoom(),
    });
}

function onZoomEnd() {
    const zoomLevel = map.value.getZoom();

    let targetMarkerGroup = "towns";
    if (showTerritories.value) {
        if (zoomLevel <= REGION_MAX_ZOOM_LEVEL) {
            targetMarkerGroup = "regions";
        } else if (zoomLevel <= DEPT_MAX_ZOOM_LEVEL) {
            targetMarkerGroup = "departements";
        } else if (zoomLevel <= CITY_MAX_ZOOM_LEVEL) {
            targetMarkerGroup = "cities";
        }
    }

    if (targetMarkerGroup !== currentMarkerGroup.value) {
        if (currentMarkerGroup.value) {
            map.value.removeLayer(markersGroup[currentMarkerGroup.value].value);
        }

        map.value.addLayer(markersGroup[targetMarkerGroup].value);
        currentMarkerGroup.value = targetMarkerGroup;
    }

    const poiIsVisible = map.value.hasLayer(markersGroup.pois.value);
    if (zoomLevel > POI_ZOOM_LEVEL) {
        if (!poiIsVisible) {
            map.value.addLayer(markersGroup.pois.value);
        }
    } else if (map.value.hasLayer(markersGroup.pois.value)) {
        map.value.removeLayer(markersGroup.pois.value);
    }
}

async function printMapScreenshot() {
    removeControls();
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
    } catch (error) {
        console.log("Failed printing the map");
    }

    restoreControls();
}

function createTownMarker(town) {
    const waterImage =
        waterImages[town.livingConditions?.water?.status.status] ||
        waterImages.unknown;
    const color = fieldTypeColors.value[town.fieldType?.id] || "#ff0000";

    const marker = L.marker([town.latitude, town.longitude], {
        icon: L.divIcon({
            className: "my-marker",
            html: `<div class="w-6 relative"${town.style ? ` style="${town.style}"` : ""
                }>
                <div
                    class="bg-white rounded-full w-6 h-6 border-2 flex items-center justify-center"
                    style="border: 3px solid ${color}"
                    ><img src="${waterImage}" class="w-4 h-4"
                /></div>
                <div
                    class="-mt-[1px] w-3 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 m-auto"
                    style="border-top-color: ${color}"
                ></div>
                <div class="absolute top-1 left-8 bg-white/75 whitespace-nowrap px-2 rb-map-address">${town.usename
                }</div>
            </div>`,
            iconAnchor: [13, 28],
        }),
    });

    if (town.id) {
        marker.on("click", () => {
            emit("townclick", town);
        });
    }

    return marker;
}

function createCircleMarker(
    markerGroupId,
    coordinates,
    chieftownCoordinates,
    content,
    radius,
    borderWidth
) {
    const size = radius * 2;
    const iconSize = size + borderWidth * 2;
    const classes = {
        regions: "w-24 h-24",
        departements: "w-24 h-24",
        cities: "",
    };

    const marker = L.marker(coordinates, {
        icon: L.divIcon({
            className: "my-marker",
            html: `<span class="opacity-75 rounded-full bg-green400 text-black flex items-center justify-center text-center border-2 border-green200 ${classes[markerGroupId]}">${content}</span>`,
            iconSize: [iconSize, iconSize],
        }),
    }).on("click", function () {
        if (map.value.getZoom() <= REGION_MAX_ZOOM_LEVEL) {
            // Nous sommes au-delà du niveau régional, un clic affiche le niveau régional
            map.value.setView(chieftownCoordinates, REGION_MAX_ZOOM_LEVEL + 1);
        } else if (map.value.getZoom() <= DEPT_MAX_ZOOM_LEVEL) {
            // nous sommes au niveau régional, un clic affiche le niveau des départements
            map.value.setView(chieftownCoordinates, DEPT_MAX_ZOOM_LEVEL + 1);
        } else if (map.value.getZoom() <= CITY_MAX_ZOOM_LEVEL) {
            // nous sommes au niveau départemental, un clic affiche le niveau des communes
            map.value.setView(chieftownCoordinates, CITY_MAX_ZOOM_LEVEL + 1);
        }
    });

    marker.addTo(markersGroup[markerGroupId].value);
}

function createPoiMarker(poi) {
    // Longitude/latitudes returned by soliguide are in the wrong order
    const coordinates = poi.location.coordinates.reverse();

    const marker = L.marker(coordinates, {
        title: poi.address,
        icon: L.divIcon({
            className: "my-marker",
            html: `<img src="${cutlery}" width="12" height="12" />`,
            iconAnchor: [13, 28],
        }),
    });
    marker.on("click", () => {
        emit("poiclick", poi);
    });

    marker.addTo(markersGroup.pois.value);
}

function removeAllTownMarkers() {
    markersGroup.towns.value.clearLayers();
}

function syncTownMarkers() {
    removeAllTownMarkers();
    if (showTerritories.value) {
        clearMarkerGroup("cities");
        clearMarkerGroup("departements");
        clearMarkerGroup("regions");
    }

    const territoryData = {
        cities: {},
        departements: {},
        regions: {},
    };
    markersGroup.towns.value.addLayers(
        towns.value.map((town) => {
            if (showTerritories.value) {
                const { city, departement, region } = town;
                if (!territoryData.cities[city.code]) {
                    territoryData.cities[city.code] = {
                        total: 0,
                        name: city.name,
                        latitude: city.latitude,
                        longitude: city.longitude,
                    };
                }

                if (!territoryData.departements[departement.code]) {
                    territoryData.departements[departement.code] = {
                        total: 0,
                        name: departement.name,
                        latitude: departement.latitude,
                        longitude: departement.longitude,
                        chieftown: departement.chieftown,
                    };
                }

                if (!territoryData.regions[region.code]) {
                    territoryData.regions[region.code] = {
                        total: 0,
                        name: region.name,
                        latitude: region.latitude,
                        longitude: region.longitude,
                        chieftown: region.chieftown,
                    };
                }

                territoryData.cities[city.code].total += 1;
                territoryData.departements[departement.code].total += 1;
                territoryData.regions[region.code].total += 1;
            }

            return createTownMarker(town);
        })
    );

    if (showTerritories.value) {
        Object.values(territoryData.regions).forEach((regionData) => {
            const { total, name, latitude, longitude, chieftown } = regionData;
            const label = total > 1 ? "sites" : "site";
            createCircleMarker(
                "regions",
                [latitude, longitude],
                [chieftown.latitude, chieftown.longitude],
                `<div><strong>${name}</strong><br/>${total} ${label}</div>`,
                20,
                3
            );
        });
        Object.values(territoryData.departements).forEach((departementData) => {
            const { total, name, latitude, longitude, chieftown } =
                departementData;
            const label = total > 1 ? "sites" : "site";
            createCircleMarker(
                "departements",
                [latitude, longitude],
                [chieftown.latitude, chieftown.longitude],
                `<div><strong>${name}</strong><br/>${total} ${label}</div>`,
                45,
                3
            );
        });
        Object.values(territoryData.cities).forEach((cityData) => {
            const { total, name, latitude, longitude } = cityData;
            const label = total > 1 ? "sites" : "site";

            createCircleMarker(
                "cities",
                [latitude, longitude],
                [latitude, longitude],
                `<div><strong>${name}</strong><br/>${total} ${label}</div>`,
                35,
                3
            );
        });
    }
}

function syncPoiMarkers() {
    markersGroup.pois.value.clearLayers();
    // sans le timeout, les nouveaux marqueurs n'apparaissent jamais :/
    setTimeout(() => {
        pois.value.forEach(createPoiMarker);
    }, 1000);
}

function clearMarkerGroup(id) {
    markersGroup[id].value.clearLayers();
    // if (markersGroupData[id]) {
    //     markersGroup[id].value.addData(markersGroupData[id]);
    // }
}

function handleParcelle(feature, layer) {
    const { numero, feuille, section, code_insee } = feature.properties;
    layer.bindTooltip(
        `N°${numero}<br/>Feuille ${feuille}<br/>Section ${section}<br/>N°INSEE ${code_insee}`
    );

    layer.on("click", () => {
        copyToClipboard(
            `N°${numero}\nFeuille ${feuille}\nSection ${section}\nN°INSEE ${code_insee}`
        );
        notificationStore.success(
            "Copie de la parcelle cadastrale",
            "Les données de cette parcelle cadastrale ont bien été copiées dans votre presse-papier"
        );
    });
}

watch(towns, syncTownMarkers);
watch(pois, syncPoiMarkers);
watch(cadastre, () => {
    markersGroup.cadastre.value.clearLayers();
    markersGroup.cadastre.value.addData(cadastre.value);
});
watch(showCadastre, () => {
    if (showCadastre.value === false) {
        if (map.value.hasLayer(markersGroup.cadastre.value)) {
            map.value.removeLayer(markersGroup.cadastre.value);
        }
    } else if (!map.value.hasLayer(markersGroup.cadastre.value)) {
        map.value.addLayer(markersGroup.cadastre.value);
        centerMap(defaultView.value.center, 18);
    }
});
watch(address, () => {
    markersGroup.search.value.clearLayers();

    if (address.value?.data?.coordinates) {
        searchMarker.addTo(markersGroup.search.value);
        searchMarker.setLatLng(address.value.data.coordinates);
        centerMap(address.value.data.coordinates, 20);
        trackEvent("Cartographie", "Recherche");
    }
});
watch(modelValue, () => {
    refreshInput(modelValue.value, false);
});

defineExpose({
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
