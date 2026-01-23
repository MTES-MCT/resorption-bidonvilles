import L from "leaflet";

// Canvas renderer pour optimiser l'affichage de nombreux marqueurs
const canvasRenderer = L.canvas({ padding: 0.5 });

const createMarqueurPoi = (poi) => {
    // Longitude/latitudes returned by soliguide are in the wrong order
    const coordinates = [...poi.position.location.coordinates].reverse();

    // Utiliser circleMarker pour un vrai rendu Canvas ultra-rapide
    return L.circleMarker(coordinates, {
        title: poi.address,
        renderer: canvasRenderer,
        radius: 10,
        // fillColor: "#e74c3c", // Rouge pour "distribution alimentaire"
        fillColor: "#3498db", // Bleu pour "distribution alimentaire"
        // fillColor: "#2ecc71", // Vert pour "distribution alimentaire"
        // fillColor: "#f1c40f", // Jaune pour "distribution alimentaire"
        // fillColor: "#000000", // Noir pour "distribution alimentaire"
        fillOpacity: 0.8,
        color: "#fff", // Bordure blanche
        weight: 2,
    });
};

export default createMarqueurPoi;
