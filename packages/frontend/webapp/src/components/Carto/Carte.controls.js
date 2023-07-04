import L from "leaflet";
import mapLayers from "./Carte.layers";

export default {
    attribution: (map) => {
        return map.attributionControl.setPosition("bottomleft");
    },
    layers: (layers) =>
        L.control.layers(
            layers.reduce((acc, key) => {
                acc[key] = mapLayers[key];
                return acc;
            }, {}),
            undefined,
            {
                collapsed: false,
            }
        ),
    printer: (printer) => {
        const Printer = L.Control.extend({
            options: {
                position: "bottomleft",
            },
            onAdd() {
                return printer;
            },
        });

        return new Printer();
    },
    zoom: (map) => {
        return map.zoomControl.setPosition("bottomright");
    },
};
