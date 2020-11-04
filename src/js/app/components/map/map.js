/* eslint-disable no-underscore-dangle */

import L from "leaflet";
import Address from "#app/components/address/address.vue";
import { get as getConfig } from "#helpers/api/config";
import "leaflet-providers";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster";

import waterYes from "../../../../../public/img/water-yes.png";
import waterNo from "../../../../../public/img/water-no.png";
import waterNull from "../../../../../public/img/water-null.png";

const DEFAULT_VIEW = [46.7755829, 2.0497727];

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
        }
    },

    data() {
        return {
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
                search: L.markerClusterGroup()
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
             * Liste des types de terrains existants
             *
             * @type {Array.<FieldType>}
             */
            fieldTypes: getConfig().field_types
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
        /**
         * Met à jour la liste des marqueurs de site
         */
        towns() {
            this.syncTownMarkers();
        },

        /**
         * Affiche/masque les adresses des sites
         *
         * @returns {undefined}
         */
        showAddresses() {
            if (this.showAddresses === true) {
                document.body.setAttribute("class", "leaflet-show-addresses");
            } else {
                document.body.setAttribute("class", "");
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
        this.syncTownMarkers();
    },

    methods: {
        /**
         * Initialise tous les contrôles de la carte
         *
         * @returns {undefined}
         */
        setupMapControls() {
            this.setupZoomControl();
            this.setupLayersControl();
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
            const layersControl = L.control.layers(this.mapLayers, undefined, {
                collapsed: false
            });

            this.map.addControl(layersControl);
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
                layers: this.mapLayers.Dessin, // fond de carte par défaut
                scrollWheelZoom: false // interdire le zoom via la molette de la souris
            });

            this.setupMapControls();
            this.setupMarkerGroups();
            this.setupView();
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
         * Supprime tous les marqueurs de site existants
         *
         * @returns {undefined}
         */
        removeAllTownMarkers() {
            this.markersGroup.towns.clearLayers();
            this.townMarkers = [];
            this.hashedTownMarkers = {};
        },

        getTownAddress(town) {
            return town.usename;
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

            const marker = L.marker(coordinates, {
                title: town.address,
                icon: L.divIcon({
                    className: "leaflet-marker",
                    html: `<span class="mapPin mapPin--shantytown">
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
