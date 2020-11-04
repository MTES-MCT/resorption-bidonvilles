import L from "leaflet";
import "leaflet-providers";

/**
 * Default zoom
 *
 * @type {number}
 */
const DEFAULT_ZOOM = 6;

/**
 * View for the center of France
 *
 * @type {MapView}
 */
const FRANCE_CENTER = {
    coordinates: [46.7755829, 2.0497727],
    zoom: DEFAULT_ZOOM
};

export default {
    props: {
        /**
         * Location value
         *
         * @type {MapView}
         */
        value: {
            type: Object,
            required: false,
            default() {
                return FRANCE_CENTER;
            }
        },

        /**
         * Status of the tutorial
         *
         * @type {String}
         */
        tutorial: {
            type: String,
            required: false,
            default: "auto"
        },

        /**
         * Whether the marker should be hidden when the tutorial is visible
         *
         * @type {Boolean}
         */
        autoHideMarker: {
            type: Boolean,
            required: false,
            default: false
        },

        /**
         * Custom wording
         *
         * @type {Object.<string,string>}
         */
        wording: {
            type: Object,
            required: false,
            default() {
                return {
                    // appears above the list of selected items
                    tutorialTitle: "Sélectionner une position géographique",
                    // label for the column containing the label of each selected item
                    tutorialDescription:
                        "Positionnez le marqueur en vous déplaçant sur la carte, puis en cliquant sur la localisation désirée."
                };
            }
        },

        /**
         * Whether the input should be disabled or not
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            /**
             * Map instance
             *
             * @type {Leaflet.Map}
             */
            map: null,

            /**
             * Marker
             *
             * @type {Leaflet.Marker}
             */
            marker: null,

            /**
             * Click timeout
             *
             * @type {Timeout|null}
             */
            clickTimeout: null,

            /**
             * Whether the tutorial should be shown, or not
             *
             * @type {Boolean}
             */
            showTutorial: this.shouldShowTutorial(this.tutorial),

            /**
             * Whether the tutorial has been closed at least once, or not
             *
             * @type {Boolean}
             */
            tutorialHasBeenClosed: false
        };
    },

    computed: {
        /**
         * Returns the current view for the marker
         *
         * @returns {MapView}
         */
        view() {
            const { lat, lng } = this.marker.getLatLng();

            return {
                coordinates: [lat, lng],
                zoom: this.map.getZoom() || DEFAULT_ZOOM
            };
        },

        /**
         * Wording for the tutorial
         *
         * @returns {Object.<string,string>}
         */
        tutorialWording() {
            if (this.disabled === true) {
                return {
                    title: "",
                    description: ""
                };
            }

            return {
                title: this.wording.tutorialTitle,
                description: this.wording.tutorialDescription
            };
        },

        /**
         * Wether the close-tutorial button should be shown
         *
         * @returns {Boolean}
         */
        showCloseTutorial() {
            return !this.disabled && this.tutorial === "auto";
        }
    },

    watch: {
        value() {
            this.syncMap(this.value, false);
        },

        tutorial() {
            this.showTutorial = this.shouldShowTutorial(this.tutorial);
        },

        showTutorial() {
            this.syncMarker();
        },

        autoHideMarker() {
            this.syncMarker();
        },

        disabled() {
            if (this.disabled === true) {
                this.showTutorial = true;
            } else {
                this.showTutorial = this.shouldShowTutorial(this.tutorial);
            }
        }
    },

    mounted() {
        this.$nextTick(this.initialize);
    },

    methods: {
        /**
         * Initializes the map
         *
         * @returns {undefined}
         */
        initialize() {
            this.map = L.map(this.$refs.map);

            this.setTileLayers();
            this.createMarker();
            this.syncMap(this.value, false);
        },

        /**
         * Sets the tile layers for the given map
         *
         * This methods sets both:
         * - the default tile layer
         * - the tile layer control
         *
         * @returns {undefined}
         */
        setTileLayers() {
            const layers = {
                Satellite: L.tileLayer.provider("Esri.WorldImagery"),
                Dessin: L.tileLayer.provider("OpenStreetMap.Mapnik")
            };

            layers.Dessin.addTo(this.map);
            L.control.layers(layers).addTo(this.map);
        },

        /**
         * Creates the marker
         *
         * @returns  {undefined}
         */
        createMarker() {
            this.marker = L.marker(this.value.coordinates, { draggable: true });
            this.map.addEventListener("click", event => {
                clearTimeout(this.clickTimeout);
                this.clickTimeout = setTimeout(
                    this.handleClick.bind(this, event),
                    200
                );
            });
            this.map.addEventListener("dblclick", () => {
                clearTimeout(this.clickTimeout);
                this.clickTimeout = null;
            });
            this.marker.addEventListener("dragend", () => {
                this.syncMap(this.view, true);
            });

            if (this.shouldShowMarker()) {
                this.marker.addTo(this.map);
            }
        },

        /**
         * Syncs the map view and the marker to the given value
         *
         * @param {View}    view        The new view value to be synced to
         * @param {boolean} [emitInput] Wether an 'input' event should be sent
         *
         * @returns {undefined}
         */
        syncMap(view, emitInput = false) {
            this.marker.setLatLng(view.coordinates);
            this.map.setView(view.coordinates, view.zoom);

            if (emitInput === true) {
                this.$emit("input", view);
            }

            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
        },

        /**
         * Handles a click on the map
         *
         * @param {Event} event
         *
         * @returns {undefined}
         */
        handleClick({ latlng: { lat, lng } }) {
            this.marker.setLatLng([lat, lng]);
            this.syncMap(this.view, true);
            this.clickTimeout = null;
        },

        /**
         * Closes the tutorial
         *
         * @returns {undefined}
         */
        closeTutorial() {
            this.showTutorial = false;
            this.tutorialHasBeenClosed = true;
        },

        /**
         * Indicates whether the marker should be shown or not
         *
         * @returns {Boolean}
         */
        shouldShowMarker() {
            return this.autoHideMarker === false || this.showTutorial !== true;
        },

        /**
         * Updates the visibility of the marker
         *
         * @returns {undefined}
         */
        syncMarker() {
            if (this.marker === null) {
                return;
            }

            if (this.shouldShowMarker()) {
                this.marker.addTo(this.map);
            } else {
                this.marker.remove();
            }
        },

        /**
         * Indicates if the tutorial should be shown, with the given tutorial directive
         *
         * @param {String} tutorial
         *
         * @returns {Boolean}
         */
        shouldShowTutorial(tutorial) {
            if (tutorial === "no") {
                return false;
            }

            if (tutorial === "yes") {
                return true;
            }

            return !this.tutorialHasBeenClosed;
        }
    }
};

/**
 * An array containing, in that order, latitude and longitude
 * @typedef {Array.<Number>} Point
 */

/**
 * A map view
 *
 * @typedef {Object} MapView
 * @property {Point}  cooordinates
 * @property {number} zoom
 */
