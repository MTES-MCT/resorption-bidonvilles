import L from "leaflet";

const canvasRenderer = L.canvas({ padding: 0.5 });

const createMarqueurPoi = (poi) => {
    const coordinates = [...poi.position.location.coordinates].reverse();

    return L.circleMarker(coordinates, {
        title: poi.address,
        renderer: canvasRenderer,
        radius: 10,
        fillColor: "#3498db",
        fillOpacity: 0.8,
        color: "#fff",
        weight: 2,
    });
};

export default createMarqueurPoi;
