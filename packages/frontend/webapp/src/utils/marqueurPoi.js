import L from "leaflet";
import cutlery from "@/assets/img/map/cutlery.png";

const createMarqueurPoi = (poi) => {
    // Longitude/latitudes returned by soliguide are in the wrong order
    const coordinates = [...poi.position.location.coordinates].reverse();

    return L.marker(coordinates, {
        title: poi.address,
        icon: L.divIcon({
            className: "my-marker",
            html: `<img src="${cutlery}" width="12" height="12" />`,
            iconAnchor: [13, 28],
        }),
    });
};

export default createMarqueurPoi;
