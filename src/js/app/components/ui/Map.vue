<template>
    <div id="map" class="w-full h-full" ref="container"></div>
</template>

<script>
import L from "leaflet";
import "leaflet-providers";

export default {
    props: {
        defaultView: {
            type: Object,
            default: () => ({
                // basically, centering on France
                center: [46.7755829, 2.0497727],
                zoom: 5
            })
        }
    },

    data() {
        return {
            map: null
        };
    },

    computed: {
        mapLayers() {
            return {
                Satellite: L.tileLayer.provider("Esri.WorldImagery"),
                Dessin: L.tileLayer.provider("OpenStreetMap.Mapnik")
            };
        }
    },

    mounted() {
        this.createMap();
        this.$refs.container.addEventListener("resize", this.resize);
    },

    beforeDestroy() {
        this.$refs.container.removeEventListener("resize", this.resize);
    },

    methods: {
        createMap() {
            this.map = L.map("map", {
                layers: this.mapLayers.Dessin // fond de carte par défaut
            });

            this.setupView();
        },

        setupView() {
            const { center, zoom } = this.defaultView;
            this.centerMap(center, zoom);
        },

        centerMap(coordinates, zoom) {
            this.map.setView(coordinates, zoom);
        },

        resize() {
            console.log("!!!!!!!!!!!!!");
            if (this.map === null) {
                return;
            }

            this.map.invalidateSize(true);
        }
    }
};
</script>
