import L from "leaflet";
import defaultMarker from "@/assets/img/map/marker.png";

export default (coordinates) =>
    L.marker(coordinates, {
        draggable: true,
        icon: L.icon({
            iconUrl: defaultMarker,
            iconSize: [30, 30],
            iconAnchor: [15, 28],
        }),
    });
