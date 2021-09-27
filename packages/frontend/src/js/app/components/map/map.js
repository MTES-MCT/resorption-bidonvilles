/* eslint-disable no-underscore-dangle */

import L from "leaflet";
import pointOnFeature from "@turf/point-on-feature";
import Address from "#app/components/address/address.vue";
import { get as getConfig } from "#helpers/api/config";
import "leaflet-providers";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster";

import waterYes from "../../../../../public/img/water-yes.png";
import utensils from "../../../../../public/img/utensils.png";
import waterNo from "../../../../../public/img/water-no.png";
import waterNull from "../../../../../public/img/water-null.png";

// données tirées de https://github.com/gregoiredavid/france-geojson
import departements from "#src/geojson/departements.json";
import regions from "#src/geojson/regions.json";

const DEFAULT_VIEW = [46.7755829, 2.0497727];
const POI_ZOOM_LEVEL = 13;
const REGION_MAX_ZOOM_LEVEL = 7;
const DEPT_MAX_ZOOM_LEVEL = 11;
const CITY_MAX_ZOOM_LEVEL = 13;

/* **************************************************************************************************
 * Ce composant fait apparaître une carte qui propose deux fonctionnalités distinctes :
 *
 * - la possibilité de faire apparaître une liste de bidonvilles sur la carte, chacun d'entre eux
 *   étant représenté par un marqueur dont la position est fixe (townMarker)
 *   Cette fonctionnalité vient avec une légende spécifique et la possibilité de faire apparaître ou
 *   non l'adresse des sites en question.
 *
 * - la possibilité de se déplacer sur la carte en recherchant une adresse via une barre de recherche
 *   avec autocomplétion (searchbar)
 ************************************************************************************************* */

export default {
    components: {
        Address
    },

    props: {
        /* *****************************
         * Options pour la liste des sites
         * ************************** */

        /**
         * Liste des bidonvilles à afficher
         *
         * @type {Array.<Shantytown>}
         */
        towns: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        },

        /**
         * Liste des points d'interets à afficher
         *
         * @type {Array.<poi>}
         */
        pois: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        },

        /* *****************************
         * Options de la searchbar
         * ************************** */

        /**
         * Indique si la searchbar doit être affichée ou non
         *
         * @type {Boolean}
         */
        displaySearchbar: {
            type: Boolean,
            required: false,
            default: true
        },

        /**
         * Placeholder de la searchbar
         *
         * @type {String}
         */
        placeholder: {
            type: String,
            required: false,
            default: "Recherchez un lieu en saisissant une adresse"
        },

        /* *****************************
         * Options génériques
         * ************************** */

        /**
         * Centre et niveau de zoom par défaut de la carte
         *
         * @type {MapView}
         */
        defaultView: {
            type: Object,
            default: () => ({
                // basically, centering on France
                center: DEFAULT_VIEW,
                zoom: 6
            })
        },

        loadTerritoryLayers: {
            type: Boolean,
            default: true,
            required: false
        },

        layerName: {
            type: String,
            required: false,
            default: "Dessin"
        }
    },

    data() {
        return {
            /**
             * La couche régionale
             *
             * @type {L.geoJSON}
             */
            regionalLayer: this.loadTerritoryLayers
                ? L.geoJSON(regions)
                : false,

            /**
             * La couche départementale
             *
             * @type {L.geoJSON}
             */
            departementalLayer: this.loadTerritoryLayers
                ? L.geoJSON(departements)
                : false,

            /**
             * La couche communal
             *
             * @type {L.layerGroup}
             */
            cityLayer: L.layerGroup(),

            /**
             * La carte
             *
             * @type {L.Map}
             */
            map: null,

            /**
             * Groupement de markers
             *
             * @type {Object.<String, L.markerClusterGroup>}
             */
            markersGroup: {
                towns: L.markerClusterGroup(),
                search: L.markerClusterGroup(),
                pois: L.markerClusterGroup({
                    disableClusteringAtZoom: POI_ZOOM_LEVEL
                })
            },

            /**
             * Search marker
             *
             * @type {L.Marker}
             */
            searchMarker: this.createSearchMarker(),

            /**
             * Town marker that was marked as a search result
             *
             * @type {L.Marker}
             */
            townSearchMarker: null,

            /**
             * Town markers
             *
             * @type {Array.<L.Marker>}
             */
            townMarkers: [],

            /**
             * POI markers
             *
             * @type {Array.<L.Marker>}
             */
            poiMarkers: [],

            /**
             * POI markers visible
             *
             * @type Boolean
             */
            poiMarkersVisible: false,

            /**
             * Town markers, hashed by coordinates
             *
             * @type {Object.<String, DOMElement>}
             */
            hashedTownMarkers: {},

            /**
             * Valeur de la searchbar
             *
             * @type {Address}
             */
            address: null,

            /**
             * Indique s'il faut afficher les adresses des sites sur la carte ou non
             *
             * Cette valeur est contrôlée par une checkbox directement sur la carte
             *
             * @type {Boolean}
             */
            showAddresses: false,

            /**
             * Value of showAddresses before the print
             *
             * Used to restore the original value after the print
             *
             * @type {Boolean}
             */
            showAddressesBeforePrint: false,

            /**
             * Wether the current print was triggered manually (from an action button) or naturally
             *
             * @type {true|null}
             */
            manualPrint: null,

            /**
             * Liste des types de terrains existants
             *
             * @type {Array.<FieldType>}
             */
            fieldTypes: getConfig().field_types,

            /**
             * Total of shantytowns per region and departement
             *
             * @type {Object}
             */
            numberOfShantytownsBy: {
                regions: {},
                departements: {},
                cities: {}
            },

            /**
             *
             */
            layersControl: null
        };
    },

    computed: {
        /**
         * Codes couleur des types de terrain, hashés par id
         *
         * @returns {Object.<String, String>}
         */
        fieldTypeColors() {
            if (!this.fieldTypes) {
                return {};
            }

            return this.fieldTypes.reduce(
                (acc, fieldType) =>
                    Object.assign(acc, {
                        [fieldType.id]: fieldType.color
                    }),
                {}
            );
        },

        /**
         * Liste des fonds de carte disponibles
         *
         * @returns {Object.<String, L.TileLayer>}
         */
        mapLayers() {
            return {
                Satellite: L.tileLayer.provider("Esri.WorldImagery"),
                Dessin: L.tileLayer.provider("OpenStreetMap.Mapnik")
            };
        }
    },

    watch: {
        towns() {
            if (this.loadTerritoryLayers) {
                this.countNumberOfTowns();
                this.loadRegionalData();
                this.loadDepartementalData();
                this.loadCityData();
            }

            this.syncTownMarkers();
        },

        pois() {
            this.syncPOIMarkers();
        },

        /**
         * Affiche/masque les adresses des sites
         *
         * @returns {undefined}
         */
        showAddresses() {
            if (this.showAddresses === true) {
                document.body.classList.add("leaflet-show-addresses");
            } else {
                document.body.classList.remove("leaflet-show-addresses");
            }
        },

        /**
         * Ajoute un résultat de recherche sur la carte
         *
         * @returns {undefined}
         */
        address() {
            if (this.address === null) {
                this.clearSearchMarker();
                return;
            }

            const {
                coordinates: [lon, lat],
                label,
                addressType: type
            } = this.address;
            this.centerMap([lat, lon], 20);

            this.$nextTick(() => {
                this.setSearchMarker(type, label, [lat, lon]);
            });
        }
    },

    mounted() {
        this.createMap();

        window.onbeforeprint = async () => {
            if (this.manualPrint !== true) {
                this.preprint(false);
            }
        };
        window.onafterprint = () => {
            this.manualPrint = null;

            document.body.classList.remove("preprint");
            this.map.addControl(this.map.zoomControl);
            this.setupLayersControl();
            this.resize();

            this.showAddresses = this.showAddressesBeforePrint;
        };
    },

    methods: {
        preprint(manualPrint = true) {
            this.manualPrint = manualPrint === true;
            this.showAddressesBeforePrint = this.showAddresses;
            this.showAddresses = true;

            document.body.classList.add("preprint");
            this.map.removeControl(this.map.zoomControl);
            this.removeLayersControl();
            this.resize();

            if (manualPrint === true) {
                setTimeout(window.print, 200);
            }
        },
        countNumberOfTowns() {
            this.numberOfShantytownsBy = this.towns.reduce(
                (acc, obj) => {
                    if (obj.closedAt !== null) {
                        return acc;
                    }

                    if (acc.departements[obj.departement.code] === undefined) {
                        acc.departements[obj.departement.code] = 0;
                    }

                    if (acc.regions[obj.region.code] === undefined) {
                        acc.regions[obj.region.code] = 0;
                    }

                    if (acc.cities[obj.city.code] === undefined) {
                        acc.cities[obj.city.code] = {};
                        acc.cities[obj.city.code].sites = 0;
                        acc.cities[obj.city.code].code = obj.city.code;
                        acc.cities[obj.city.code].name = obj.city.name;
                        acc.cities[obj.city.code].latitude = obj.city.latitude;
                        acc.cities[obj.city.code].longitude =
                            obj.city.longitude;
                    }

                    acc.departements[obj.departement.code] += 1;
                    acc.regions[obj.region.code] += 1;
                    acc.cities[obj.city.code].sites += 1;

                    return acc;
                },
                { regions: {}, departements: {}, cities: {} }
            );
        },
        /**
         * Initialise tous les contrôles de la carte
         *
         * @returns {undefined}
         */
        setupMapControls() {
            this.setupZoomControl();
            this.setupLayersControl();
            this.setupPrintControl();
            this.setupAddressTogglerControl();
            this.setupFieldTypesLegendControl();
        },

        /**
         * Initialise le contrôle "Zoom"
         *
         * @returns {undefined}
         */
        setupZoomControl() {
            this.map.zoomControl.setPosition("bottomright");
        },

        /**
         * Initialise le contrôle "Fonds de carte"
         *
         * @returns {undefined}
         */
        setupLayersControl() {
            if (!this.layersControl) {
                this.layersControl = L.control.layers(
                    this.mapLayers,
                    undefined,
                    {
                        collapsed: false
                    }
                );
            }

            if (!this.layersControl._map) {
                this.map.addControl(this.layersControl);
            }
        },

        /**
         *
         */
        removeLayersControl() {
            if (this.layersControl) {
                this.map.removeControl(this.layersControl);
            }
        },

        /**
         * Initialise le contrôle "Voir les adresses des sites"
         *
         * @returns {undefined}
         */
        setupPrintControl() {
            const { printer } = this.$refs;
            const Printer = L.Control.extend({
                options: {
                    position: "bottomright"
                },

                onAdd() {
                    return printer;
                }
            });

            this.map.addControl(new Printer());
        },

        /**
         * Initialise le contrôle "Voir les adresses des sites"
         *
         * @returns {undefined}
         */
        setupAddressTogglerControl() {
            const { adressToggler } = this.$refs;
            const AddressToggler = L.Control.extend({
                options: {
                    position: "bottomleft"
                },

                onAdd() {
                    return adressToggler;
                }
            });

            this.map.addControl(new AddressToggler());
        },

        /**
         * Initialise le contrôle "Légende"
         *
         * @returns {undefined}
         */
        setupFieldTypesLegendControl() {
            const { legends } = this.$refs;
            const Legend = L.Control.extend({
                options: {
                    position: "bottomleft"
                },

                onAdd() {
                    return legends;
                }
            });

            this.map.addControl(new Legend());
        },

        /**
         * Initialise tous les clusters de markers
         *
         * @returns {undefined}
         */
        setupMarkerGroups() {
            this.map.addLayer(this.markersGroup.towns);
            this.map.addLayer(this.markersGroup.search);
            this.map.addLayer(this.markersGroup.pois);
        },

        /**
         * Met en place la vue par défaut sur la carte
         *
         * @returns {undefined}
         */
        setupView() {
            const { center, zoom } = this.defaultView;
            this.centerMap(center, zoom);
        },

        /**
         * Crée la carte et initialise sa vue et ses contrôles
         *
         * Attention, cette méthode n'initialise pas le contenu (les markers) de la carte !
         *
         * @returns {undefined}
         */
        createMap() {
            this.map = L.map("map", {
                layers: this.mapLayers[this.layerName], // fond de carte à afficher
                scrollWheelZoom: false // interdire le zoom via la molette de la souris
            });

            this.map.on("zoomend", this.onZoomEnd);

            this.setupMapControls();
            this.setupMarkerGroups();
            this.setupView();
            this.onZoomEnd();
        },

        /**
         * Affiche les points d'interet à partir d'un certain niveau de zoom
         *
         * @returns {undefined}
         */
        onZoomEnd() {
            const zoomLevel = this.map.getZoom();

            if (this.loadTerritoryLayers) {
                if (zoomLevel <= REGION_MAX_ZOOM_LEVEL) {
                    this.showRegionalLayer();
                } else if (zoomLevel <= DEPT_MAX_ZOOM_LEVEL) {
                    this.showDepartementalLayer();
                } else if (zoomLevel <= CITY_MAX_ZOOM_LEVEL) {
                    this.showCityLayer();
                } else {
                    this.showTownsLayer();
                }
            } else {
                this.showTownsLayer();
            }

            if (!this.poiMarkersVisible && zoomLevel > POI_ZOOM_LEVEL) {
                this.poiMarkersVisible = true;
                this.pois.forEach(this.createPOIMarker);
            } else if (this.poiMarkersVisible && zoomLevel <= POI_ZOOM_LEVEL) {
                this.poiMarkersVisible = false;
                this.removeAllPOIMarkers();
            }
        },

        /**
         * Supprime et recrée la liste des marqueurs de site
         *
         * @returns {undefined}
         */
        syncTownMarkers() {
            this.removeAllTownMarkers();
            this.towns.forEach(this.createTownMarker);
        },

        /**
         * Supprime et recrée la liste des marqueurs de site
         *
         * @returns {undefined}
         */
        syncPOIMarkers() {
            this.removeAllPOIMarkers();
            if (this.poiMarkersVisible) {
                this.pois.forEach(this.createPOIMarker);
            }
        },

        /**
         * Supprime tous les marqueurs de site existants
         *
         * @returns {undefined}
         */
        removeAllTownMarkers() {
            this.markersGroup.towns.clearLayers();
            this.townMarkers = [];
            this.hashedTownMarkers = {};
        },

        /**
         * Supprime tous les marqueurs de site existants
         *
         * @returns {undefined}
         */
        removeAllPOIMarkers() {
            this.markersGroup.pois.clearLayers();
            this.poiMarkers = [];
        },

        getTownAddress(town) {
            return town.name
                ? `${town.address} « ${town.name} »`
                : town.address;
        },

        getTownCoordinates(town) {
            const { latitude, longitude } = town;
            return [latitude, longitude];
        },

        getTownColor(town) {
            if (town.fieldType !== undefined) {
                return this.fieldTypeColors[town.fieldType.id];
            }

            return "#cccccc";
        },

        getTownWaterImage(town) {
            if (town.accessToWater === true) {
                return waterYes;
            }

            if (town.accessToWater === false) {
                return waterNo;
            }

            return waterNull;
        },

        /**
         * Crée le marqueur de résultat de recherche
         *
         * @returns {L.Marker}
         */
        createSearchMarker() {
            return L.marker(DEFAULT_VIEW, {
                title: "A",
                icon: L.divIcon({
                    className: "leaflet-marker",
                    html: `<span class="mapPin mapPin--result">
                        <span class="mapPin-wrapper">
                            <span class="mapPin-marker" style="background-color: red"></span>
                        </span>
                        <span class="mapPin-address"></span>
                    </span>`,
                    iconAnchor: [13, 28]
                })
            });
        },

        /**
         * Crée un marqueur de site et l'ajoute sur la carte
         *
         * @param {Shantytown} town
         *
         * @returns {undefined}
         */
        createTownMarker(town) {
            const address = this.getTownAddress(town);
            const coordinates = this.getTownCoordinates(town);
            const color = this.getTownColor(town);
            const waterImage = this.getTownWaterImage(town);
            const style = town.style ? `style="${town.style}"` : "";

            const marker = L.marker(coordinates, {
                title: address,
                icon: L.divIcon({
                    className: "leaflet-marker",
                    html: `<span class="mapPin mapPin--shantytown" ${style}>
                        <span class="mapPin-wrapper">
                            <span class="mapPin-water"><img src="${waterImage}" /></span>
                            <span class="mapPin-marker" style="background-color: ${color}"></span>
                        </span>
                        <span class="mapPin-address">${address}</span>
                    </span>`,
                    iconAnchor: [13, 28]
                })
            });
            marker.on("click", this.handleTownMarkerClick.bind(this, town));
            marker.on("add", () => {
                if (marker.searchResult === true) {
                    this.markTownAsSearchResult(marker);
                }
            });

            marker.addTo(this.markersGroup.towns);
            this.townMarkers.push(marker);
            this.hashedTownMarkers[coordinates.join(";")] = marker;
        },

        /**
         * Crée un marqueur de site et l'ajoute sur la carte
         *
         * @param {Shantytown} town
         *
         * @returns {undefined}
         */
        createPOIMarker(poi) {
            // Longitude/latitudes returned by soliguide are in the wrong order
            const coordinates = poi.location.coordinates.reverse();

            const marker = L.marker(coordinates, {
                title: poi.address,
                icon: L.divIcon({
                    className: "leaflet-marker",
                    html: `<span class="mapPin mapPin--poi" >
                        <span class="mapPin-wrapper">
                            <img src="${utensils}" width="12" height="12"/>
                        </span>
                        <span class="mapPin-address">${poi.address}</span>
                    </span>`,
                    iconAnchor: [13, 28]
                })
            });
            marker.on("click", this.handlePOIMarkerClick.bind(this, poi));

            marker.addTo(this.markersGroup.pois);

            this.poiMarkers.push(marker);
        },

        /**
         * Gère un clic sur un marqueur de site
         *
         * @param {L.Marker} marker
         * @param {Event}    event
         *
         * @returns {undefined}
         */
        handleTownMarkerClick(marker, event) {
            this.$emit("town-click", marker, event);
        },

        /**
         * Gère un clic sur un marqueur de point d'interet
         *
         * @param {L.Marker} marker
         * @param {Event}    event
         *
         * @returns {undefined}
         */
        handlePOIMarkerClick(marker, event) {
            this.$emit("poi-click", marker, event);
        },

        /**
         * Met à jour le centre et le zoom de la carte
         *
         * @param {MapCoordinates} coordinates
         * @param {Number}         zoom
         *
         * @returns {undefined}
         */
        centerMap(coordinates, zoom) {
            this.map.setView(coordinates, zoom);
        },

        /**
         * Force un redimensionnement de la carte pour prendre toute la place disponible
         *
         * @returns {undefined}
         */
        resize() {
            if (this.map === null) {
                return;
            }

            this.map.invalidateSize(true);
        },

        clearSearchMarker() {
            if (this.townSearchMarker !== null) {
                if (this.townSearchMarker._icon) {
                    this.townSearchMarker._icon
                        .querySelector(".mapPin")
                        .classList.remove("mapPin--result");
                }

                this.townSearchMarker.searchResult = false;
                this.townSearchMarker = null;
                return;
            }

            this.searchMarker.remove();
        },

        getMatchingTownMarker(coordinates) {
            return this.hashedTownMarkers[coordinates.join(";")] || null;
        },

        markTownAsSearchResult(marker) {
            this.townSearchMarker = marker;
            this.townSearchMarker.searchResult = true;
            marker._icon
                .querySelector(".mapPin")
                .classList.add("mapPin--result");
        },

        setSearchMarker(type, address, coordinates) {
            this.$trackMatomoEvent("Cartographie", "Recherche");
            this.clearSearchMarker();

            // check if there is a marker existing at that exact address
            const townMarker = this.getMatchingTownMarker(coordinates);
            if (townMarker !== null) {
                this.markTownAsSearchResult(townMarker);
                return;
            }

            this.searchMarker.addTo(this.markersGroup.search);
            this.searchMarker.setLatLng(coordinates);

            this.searchMarker._icon.querySelector(
                ".mapPin-address"
            ).innerHTML = address;

            let action = "add";
            if (type !== "housenumber") {
                action = "remove";
            }

            this.searchMarker._icon
                .querySelector(".mapPin")
                .classList[action]("mapPin--street");
        },

        // Fonction de chargement des données geoJson régionales
        loadRegionalData() {
            this.regionalLayer.getLayers().forEach(layer => {
                if (layer instanceof L.Marker) {
                    layer.remove();
                    return;
                }

                // Calcul de la position du marqueur
                // On utilise la méthode pointOnFeature(), qui garantit que le point soit dans le polygone, plutôt que centroid()
                const { feature } = layer;
                const markerPosition = pointOnFeature(feature);
                // Création du marqueur à partir de la long et lat retournées par pointOnFeature()
                const lon = markerPosition.geometry.coordinates[0];
                const lat = markerPosition.geometry.coordinates[1];
                const nbSites =
                    this.numberOfShantytownsBy.regions[
                        feature.properties.code
                    ] || 0;
                if (nbSites > 0) {
                    this.circleWithText(
                        this.map,
                        [lat, lon],
                        this.numberOfShantytownsBy.regions[
                            feature.properties.code
                        ] || 0,
                        20,
                        3,
                        "region"
                    ).addTo(this.regionalLayer);
                    this.regionalLayer.setStyle({
                        color: "white",
                        weight: 8,
                        opacity: 1
                    });
                }
            });
        },

        // Fonction de chargement des données geoJson départementales
        loadDepartementalData() {
            this.departementalLayer.getLayers().forEach(layer => {
                if (layer instanceof L.Marker) {
                    layer.remove();
                    return;
                }

                // Calcul de la position du marqueur
                // On utilise la méthode pointOnFeature(), qui garantit que le point soit dans le polygone, plutôt que centroid()
                const { feature } = layer;
                const markerPosition = pointOnFeature(feature);
                // Création du marqueur à partir de la long et lat retournées par pointOnFeature()
                const lon = markerPosition.geometry.coordinates[0];
                const lat = markerPosition.geometry.coordinates[1];

                const nbSites =
                    this.numberOfShantytownsBy.departements[
                        feature.properties.code
                    ] || 0;
                const siteLabel = nbSites > 1 ? "sites" : "site";
                if (nbSites > 0) {
                    this.circleWithText(
                        this.map,
                        [lat, lon],
                        `<div><strong>${feature.properties.nom}</strong><br/>${nbSites} ${siteLabel}</div>`,
                        45,
                        3,
                        "dept"
                    ).addTo(this.departementalLayer);
                    this.departementalLayer.setStyle({
                        color: "white",
                        weight: 8,
                        opacity: 1
                    });
                }
            });
        },

        // Fonction de chargement des marqueurs par commune
        loadCityData() {
            // On crée les marqueurs
            const citiesMarkers = [];
            // for (var key of Object.keys(this.numberOfShantytownsBy.cities)) {
            Object.keys(this.numberOfShantytownsBy.cities).forEach(key => {
                const siteLabel =
                    this.numberOfShantytownsBy.cities[key].sites > 1
                        ? "sites"
                        : "site";
                citiesMarkers.push(
                    this.circleWithText(
                        this.map,
                        [
                            this.numberOfShantytownsBy.cities[key].latitude,
                            this.numberOfShantytownsBy.cities[key].longitude
                        ],
                        `<div>${this.numberOfShantytownsBy.cities[key].name}<br/>${this.numberOfShantytownsBy.cities[key].sites} ${siteLabel}</div>`,
                        35,
                        3,
                        "city"
                    )
                );
            });
            this.cityLayer = L.layerGroup(citiesMarkers);
        },

        showRegionalLayer() {
            this.hideDepartementalLayer();
            this.hideCityLayer();
            this.hideTownsLayer();

            if (!this.map.hasLayer(this.regionalLayer)) {
                this.map.addLayer(this.regionalLayer);
            }
        },

        hideRegionalLayer() {
            if (this.map.hasLayer(this.regionalLayer)) {
                this.map.removeLayer(this.regionalLayer);
            }
        },

        showDepartementalLayer() {
            this.hideRegionalLayer();
            this.hideCityLayer();
            this.hideTownsLayer();

            if (!this.map.hasLayer(this.departementalLayer)) {
                this.map.addLayer(this.departementalLayer);
            }
        },

        hideDepartementalLayer() {
            if (this.map.hasLayer(this.departementalLayer)) {
                this.map.removeLayer(this.departementalLayer);
            }
        },

        showCityLayer() {
            this.hideRegionalLayer();
            this.hideDepartementalLayer();
            this.hideTownsLayer();

            if (!this.map.hasLayer(this.cityLayer)) {
                this.map.addLayer(this.cityLayer);
            }
        },

        hideCityLayer() {
            if (this.map.hasLayer(this.cityLayer)) {
                this.map.removeLayer(this.cityLayer);
            }
        },

        showTownsLayer() {
            this.hideRegionalLayer();
            this.hideDepartementalLayer();
            this.hideCityLayer();
            this.syncTownMarkers();
        },

        hideTownsLayer() {
            this.removeAllTownMarkers();
        },

        circleWithText(map, latLng, txt, radius, borderWidth, circleClass) {
            const size = radius * 2;
            const style =
                'style="width: ' +
                size +
                "px; height: " +
                size +
                "px; border-width: " +
                borderWidth +
                'px;"';
            const iconSize = size + borderWidth * 2;
            const icon = L.divIcon({
                html:
                    '<span class="' +
                    "circle " +
                    circleClass +
                    '" ' +
                    style +
                    ">" +
                    txt +
                    "</span>",
                className: "",
                iconSize: [iconSize, iconSize]
            });
            const marker = L.marker(latLng, {
                icon: icon
            }).on("click", function(e) {
                if (map.getZoom() <= REGION_MAX_ZOOM_LEVEL) {
                    // Nous sommes au-delà du niveau régional, un clic affiche le niveau régional
                    map.setView(
                        e.target.getLatLng(),
                        REGION_MAX_ZOOM_LEVEL + 1
                    );
                } else if (map.getZoom() <= DEPT_MAX_ZOOM_LEVEL) {
                    // nous sommes au niveau régional, un clic affiche le niveau des départements
                    map.setView(e.target.getLatLng(), DEPT_MAX_ZOOM_LEVEL + 1);
                } else if (map.getZoom() <= CITY_MAX_ZOOM_LEVEL) {
                    // nous sommes au niveau départemental, un clic affiche le niveau des communes
                    map.setView(e.target.getLatLng(), CITY_MAX_ZOOM_LEVEL + 1);
                }
            });
            return marker;
        }
    }
};

/**
 * @typedef {Array} MapCoordinates
 * @property {Float} [0] Latitude
 * @property {Float} [1] Longitude
 */

/**
 * @typedef {Object} MapView
 * @property {MapCoordinates} center Coordonnées géographiques du centre de la vue
 * @property {Number}         zoom   Niveau de zoom, voir la documentation de Leaflet
 */

/**
 * @typedef {Object} Address Une adresse au format adresse.data.gouv.fr
 * @property {String}         label       Adresse complète
 * @property {String}         city        Nom de la ville
 * @property {String}         citycode    Code communal (/!\ différent du code postal)
 * @property {MapCoordinates} coordinates Coordonnées géographiques
 */
