import L from 'leaflet';

export default {
    props: {
        towns: Array,
    },
    data() {
        return {
            map: null,
            markers: [],
        };
    },
    watch: {
        towns() {
            this.updateMarkers();
        },
    },
    mounted() {
        if (this.map !== null) {
            return;
        }

        const layers = {
            // Satellite: L.tileLayer(viz.leaflet.tiles.OpenStreetMap.satellite, { attribution: viz.leaflet.tiles.OpenStreetMap.attribution }),
            Streets: L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FmaW5lYW4iLCJhIjoiY2pwODY2azc0MTh5aTNwbzM3ODRsbnNoNCJ9.9QOOO9zRHbrSAsYdh5DBNQ', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1Ijoic2FmaW5lYW4iLCJhIjoiY2pwODY2azc0MTh5aTNwbzM3ODRsbnNoNCJ9.9QOOO9zRHbrSAsYdh5DBNQ',
            }),
        };

        this.map = L.map('map', { layers: [layers.Streets] }).setView([43.3050621, 0.684586], 8);
        L.control.layers(layers).addTo(this.map);

        this.updateMarkers();
    },
    methods: {
        updateMarkers() {
            this.markers.forEach(marker => marker.remove());
            this.markers = [];

            this.towns.forEach((town) => {
                const { latitude, longitude } = town;
                const marker = L.marker([latitude, longitude]);
                marker.addTo(this.map);
                this.markers.push(marker);
            });
        },
    },
};
