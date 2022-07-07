<template>
  <div class="w-full h-full relative">
    <Tooltip v-if="userLocation === null"></Tooltip>
    <div id="map" class="w-full h-full" ref="container"></div>
    <p>{{ showError }}</p>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Tooltip from "./Map/Tooltip.vue";
import "leaflet-providers";

// leaflet heack for fixing the default marker
// @see https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const DEFAULT_VIEW = [46.7755829, 2.0497727];

export default {
  components: {
    Tooltip,
  },

  props: {
    nearbyTowns: {
      type: Array,
    },
    zoom: {
      type: Number,
      required: false,
      default: 5,
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      showError: "",
      map: null,
      marker: null,
      clickTimeout: null,
      userLocation: null,
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
        zoom: this.zoom,
      };
    },
    mapLayers() {
      return {
        Satellite: L.tileLayer.provider("Esri.WorldImagery"),
        Dessin: L.tileLayer.provider("OpenStreetMap.Mapnik"),
      };
    },
  },

  watch: {
    userLocation() {
      this.$emit("locationChange", this.userLocation);
      this.syncMarker();
      this.refreshView();
    },
  },

  async mounted() {
    this.initializeMap();
  },

  methods: {
    success(position) {
      this.userLocation = [position.coords.latitude, position.coords.longitude];
    },
    error(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.showError = "User denied the request for Geolocation.";
          break;
        case error.POSITION_UNAVAILABLE:
          this.showError = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          this.showError = "The request to get user location timed out.";
          break;
        case error.UNKNOWN_ERROR:
          this.showError = "An unknown error occurred.";
          break;
      }
    },

    initializeMap() {
      // initialize watch on Location
      try {
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(this.success, this.error);
        } else {
          this.showError = "Geolocation is not supported by this browser.";
        }
      } catch (e) {
        //  ignore
      }
      this.createMap();
      this.syncMarker();
      this.refreshView();
    },
    createMap() {
      this.map = L.map("map", {
        layers: this.mapLayers.Dessin, // fond de carte par défaut
        scrollWheelZoom: false,
      });
    },

    refreshView(emitInput = false) {
      const { center, zoom } = this.view;
      this.map.setView(center, (this.map && this.map.getZoom()) || zoom);

      if (emitInput === true) {
        this.$emit("input", this.coordinates);
      }
    },

    syncMarker() {
      if (this.userLocation === null) {
        this.removeMarker();
      } else if (this.marker === null) {
        this.createMarker();
      } else {
        this.marker.setLatLng(this.userLocation);
      }
    },

    createMarker() {
      if (this.marker !== null && this.userLocation !== null) {
        return;
      }

      this.marker = L.marker(this.userLocation, { draggable: true });
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
  },
};
</script>
