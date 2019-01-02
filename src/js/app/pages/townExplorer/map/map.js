import Address from '#app/components/address/address.vue';
import L from 'leaflet';
import 'leaflet-providers';

export default {
    components: {
        Address,
    },
    props: {
        trackPosition: {
            type: Boolean,
            default: false,
        },
        towns: {
            type: Array,
            default() {
                return [];
            },
        },
        defaultView: {
            type: Object,
            default: () => ({
                // basically, centering on France
                center: [46.7755829, 2.0497727],
                zoom: 6,
            }),
        },
        autofocus: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: 'Centrez la carte sur un point précis en tapant ici le nom d\'une commune, département, région, ...',
        },
        showAddress: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        const positionMarker = L.marker([0, 0], { draggable: true });
        positionMarker.addEventListener('dragend', this.onDrag);

        return {
            map: null,
            positionMarker,
            townMarkers: [],
            address: null,
        };
    },
    computed: {
        label() {
            return this.address !== null ? this.address.label : null;
        },
        coordinates() {
            const { lat, lng } = this.positionMarker.getLatLng();
            return [lat, lng];
        },
        city() {
            return this.address !== null ? this.address.city : null;
        },
        citycode() {
            return this.address !== null ? this.address.citycode : null;
        },
        value() {
            return {
                label: this.label,
                city: this.city,
                citycode: this.citycode,
                coordinates: this.coordinates,
            };
        },
    },
    watch: {
        trackPosition() {
            this.syncPositionMarker();
        },
        towns() {
            this.syncTownMarkers();
        },
        address() {
            if (this.address !== null) {
                const { coordinates } = this.address;
                this.setView([coordinates[1], coordinates[0]], 13);
            }

            this.$emit('input', this.value);
        },
    },
    mounted() {
        this.createMap();
        this.syncPositionMarker();
        this.syncTownMarkers();
    },
    methods: {
        createMap() {
            const layers = this.getMapLayers();
            this.map = L.map('map', { layers: Object.values(layers) });
            L.control.layers(layers).addTo(this.map);

            const { center, zoom } = this.defaultView;
            this.setView(center, zoom);

            this.map.addEventListener('click', (event) => {
                const { lat, lng } = event.latlng;
                this.positionMarker.setLatLng([lat, lng]);
                this.$emit('input', this.value);
            });
        },
        getMapLayers() {
            return {
                Satellite: L.tileLayer.provider('Esri.WorldImagery'),
                Dessin: L.tileLayer.provider('OpenStreetMap.Mapnik'),
            };
        },
        addTownMarker(town) {
            const { latitude, longitude } = town;
            const marker = L.marker([latitude, longitude]);
            marker.addTo(this.map);
            marker.on('click', this.handleTownMarkerClick.bind(this, town));
            this.townMarkers.push(marker);
        },
        removeAllTownMarkers() {
            this.townMarkers.forEach(marker => marker.remove());
            this.townMarkers = [];
        },
        syncTownMarkers() {
            this.removeAllTownMarkers();
            this.towns.forEach(this.addTownMarker);
        },
        syncPositionMarker() {
            if (this.trackPosition === true) {
                this.positionMarker.addTo(this.map);
            } else {
                this.positionMarker.remove();
            }
        },
        handleTownMarkerClick(marker, event) {
            this.$emit('town-click', marker, event);
        },
        setView(coordinates, zoom) {
            this.positionMarker.setLatLng(coordinates);
            this.map.setView(coordinates, zoom);
        },
        onDrag() {
            this.$emit('input', this.value);
        },
    },
};
