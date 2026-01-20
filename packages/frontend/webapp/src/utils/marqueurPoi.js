import L from "leaflet";
import cutlery from "@/assets/img/map/cutlery.png";

export default (poi) => {
    // Longitude/latitudes returned by soliguide are in the wrong order
    // Créer une copie pour éviter de modifier l'original
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
