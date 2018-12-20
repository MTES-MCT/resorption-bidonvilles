import L from 'leaflet';

export default {
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
            const map = L.map(
                'map',
                {
                    layers: this.getMapLayers(),
                },
            );
            map.setView(this.center, 8);
            return map;
        },
        getMapLayers() {
            return [
                // Satellite view:
                // L.tileLayer(
                //     viz.leaflet.tiles.OpenStreetMap.satellite,
                //     {
                //         attribution: viz.leaflet.tiles.OpenStreetMap.attribution,
                //     },
                // ),

                // Street view:
                L.tileLayer(
                    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FmaW5lYW4iLCJhIjoiY2pwODY2azc0MTh5aTNwbzM3ODRsbnNoNCJ9.9QOOO9zRHbrSAsYdh5DBNQ',
                    {
                        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                        maxZoom: 18,
                        id: 'mapbox.streets',
                    },
                ),
            ];
        },
        removeAllMarkers() {
            this.markers.forEach(marker => marker.remove());
            this.markers = [];
        },
        syncMarkersToTowns() {
            this.removeAllMarkers();
            this.towns.forEach(this.addMarker);
        },
        addMarker({ latitude, longitude }) {
            const marker = L.marker([latitude, longitude]);
            marker.addTo(this.map);
            this.markers.push(marker);
        },
    },
};
