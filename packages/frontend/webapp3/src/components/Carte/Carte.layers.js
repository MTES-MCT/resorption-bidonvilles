import L from "leaflet";
import "leaflet-providers";

export default {
    Satellite: L.tileLayer.provider("Esri.WorldImagery"),
    Dessin: L.tileLayer.provider("OpenStreetMap.Mapnik"),
};
