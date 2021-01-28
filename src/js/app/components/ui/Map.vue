<template>
    <div id="map" class="w-full h-full" ref="container"></div>
</template>

<script>
import L from "leaflet";
import "leaflet-providers";

const DEFAULT_VIEW = [46.7755829, 2.0497727];

export default {
    props: {
        value: {
            type: Array,
            required: false
        },

        zoom: {
            type: Number,
            required: false,
            default: 5
        }
    },

    data() {
        return {
            map: null,
            marker: null,
            clickTimeout: null
        };
    },

    computed: {
        coordinates() {
            if (this.marker === null) {
                return undefined;
            }

            const { lat, lng } = this.marker.getLatLng();
            return [lat, lng];
        },
        view() {
            return {
                center: this.coordinates || DEFAULT_VIEW,
                zoom: this.zoom
            };
        },
        mapLayers() {
            return {
                Satellite: L.tileLayer.provider("Esri.WorldImagery"),
                Dessin: L.tileLayer.provider("OpenStreetMap.Mapnik")
            };
        }
    },

    watch: {
        value() {
            this.syncMarker();
            this.refreshView();
        }
    },

    mounted() {
        this.createMap();
        this.syncMarker();
        this.refreshView();
    },

    methods: {
        createMap() {
            this.map = L.map("map", {
                layers: this.mapLayers.Dessin // fond de carte par défaut
            });
        },

        refreshView(emitInput = false) {
            const { center, zoom } = this.view;
            this.map.setView(center, zoom);

            if (emitInput === true) {
                this.$emit("input", this.coordinates);
            }
        },

        syncMarker() {
            if (this.value === undefined) {
                this.removeMarker();
            } else if (this.marker === null) {
                this.createMarker();
            } else {
                this.marker.setLatLng(this.value);
            }
        },

        createMarker() {
            if (this.marker !== null && this.value !== undefined) {
                return;
            }

            this.marker = L.marker(this.value, { draggable: true });
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
                this.refreshView(true);
            });

            this.marker.addTo(this.map);
        },

        removeMarker() {
            if (this.marker === null) {
                return;
            }

            this.marker.remove();
            this.marker = null;
        },

        handleClick({ latlng: { lat, lng } }) {
            if (this.marker === null) {
                return;
            }

            this.marker.setLatLng([lat, lng]);
            this.refreshView(true);

            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
        }
    }
};
</script>
