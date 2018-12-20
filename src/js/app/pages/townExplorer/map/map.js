import Address from '#app/components/address/address.vue';
import L from 'leaflet';
import 'leaflet-providers';

export default {
    components: {
        Address,
    },
    props: {
        towns: Array,
        center: Array,
    },
    data() {
        return {
            map: null,
            markers: [],
        };
    },
    watch: {
        towns() {
            this.syncMarkersToTowns();
        },
    },
    mounted() {
        this.map = this.createMap();
        this.syncMarkersToTowns();
    },
    methods: {
        createMap() {
            const layers = this.getMapLayers();
            const map = L.map('map', { layers: Object.values(layers) });
            L.control.layers(layers).addTo(map);
            map.setView(this.center, 8);
            return map;
        },
        getMapLayers() {
            return {
                Satellite: L.tileLayer.provider('Esri.WorldImagery'),
                Dessin: L.tileLayer.provider('OpenStreetMap.Mapnik'),
            };
        },
        removeAllMarkers() {
            this.markers.forEach(marker => marker.remove());
            this.markers = [];
        },
        syncMarkersToTowns() {
            this.removeAllMarkers();
            this.towns.forEach(this.addMarker);
        },
        addMarker(town) {
            const { latitude, longitude } = town;
            const marker = L.marker([latitude, longitude]);
            marker.addTo(this.map);
            marker.on('click', this.handleMarkerClick.bind(this, town));
            this.markers.push(marker);
        },
        handleMarkerClick(town, event) {
            this.$emit('marker-click', town, event);
        },
        onNewAddress(coordinates) {
            this.map.setView([coordinates[1], coordinates[0]], 13);
        },
    },
};
