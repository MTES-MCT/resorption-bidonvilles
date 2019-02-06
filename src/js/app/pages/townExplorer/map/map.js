import Address from '#app/components/address/address.vue';
import L from 'leaflet';
import 'leaflet-providers';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';

// eslint-disable-next-line
import blackMarker from '/img/markers/black.svg';
// eslint-disable-next-line
import orangeMarker from '/img/markers/orange.svg';
// eslint-disable-next-line
import redMarker from '/img/markers/red.svg';

const DEFAULT_VIEW = [46.7755829, 2.0497727];
const ICONS = {
    1: L.icon({
        iconUrl: blackMarker,
        iconSize: [42, 40],
        iconAnchor: [0, 0],
    }),
    2: L.icon({
        iconUrl: redMarker,
        iconSize: [42, 40],
        iconAnchor: [0, 0],
    }),
    3: L.icon({
        iconUrl: orangeMarker,
        iconSize: [42, 40],
        iconAnchor: [0, 0],
    }),
    4: L.icon({
        iconUrl: orangeMarker,
        iconSize: [42, 40],
        iconAnchor: [0, 0],
    }),
};

export default {
    components: {
        Address,
    },
    props: {
        value: {
            type: Object,
            default: null,
        },
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
                center: DEFAULT_VIEW,
                zoom: 6,
            }),
        },
        autofocus: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: 'Recherchez un lieu en saisissant une adresse',
        },
        showAddress: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        const coordinates = this.value && this.value.coordinates ? this.value.coordinates : DEFAULT_VIEW;

        const positionMarker = L.marker(coordinates, { draggable: true });
        positionMarker.addEventListener('dragend', this.onDrag);

        return {
            map: null,
            markersGroup: null,
            positionMarker,
            townMarkers: [],
            address: this.value,
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
        input() {
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

            this.$emit('input', this.input);
        },
    },
    mounted() {
        this.createMap();
        this.syncPositionMarker();
        this.syncTownMarkers();
    },
    methods: {
        resize() {
            this.map.invalidateSize(true);
        },
        createMap() {
            const layers = this.getMapLayers();
            this.map = L.map('map', {
                layers: Object.values(layers),
                scrollWheelZoom: false,
                zoomDelta: 2.5,
            });
            this.map.zoomControl.setPosition('bottomright');
            L.control.layers(layers, undefined, { collapsed: false }).addTo(this.map);

            const { center, zoom } = this.defaultView;
            if (this.value === null) {
                this.setView(center, zoom);
            } else {
                this.centerMap(center, zoom);
            }

            this.markersGroup = L.markerClusterGroup();
            this.map.addLayer(this.markersGroup);

            this.map.addEventListener('click', (event) => {
                const { lat, lng } = event.latlng;
                this.positionMarker.setLatLng([lat, lng]);
                this.$emit('input', this.input);
            });
        },
        getMapLayers() {
            return {
                Satellite: L.tileLayer.provider('Esri.WorldImagery'),
                Dessin: L.tileLayer.provider('Wikimedia'),
            };
        },
        addTownMarker(town) {
            const { latitude, longitude } = town;
            const marker = L.marker([latitude, longitude], {
                title: town.address,
                icon: ICONS[town.priority || 3],
            });
            this.markersGroup.addLayer(marker);

            marker.on('click', this.handleTownMarkerClick.bind(this, town));
            this.townMarkers.push(marker);
        },
        removeAllTownMarkers() {
            this.markersGroup.clearLayers();
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
        centerMap(coordinates, zoom) {
            this.map.setView(coordinates, zoom);
        },
        setView(coordinates, zoom) {
            this.positionMarker.setLatLng(coordinates);
            this.centerMap(coordinates, zoom);
        },
        onDrag() {
            this.$emit('input', this.input);
        },
    },
};
