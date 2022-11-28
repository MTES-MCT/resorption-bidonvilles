import L from "leaflet";
import mapLayers from "./Carte.layers";

export default {
    attribution: (map) => {
        map.attributionControl.setPosition("bottomleft");
    },
    zoom(map) {
        map.zoomControl.setPosition("bottomright");
    },
    layers() {
        return L.control.layers(mapLayers, undefined, {
            collapsed: false,
        });
    },
    scale(map) {
        const scaleControl = L.control
            .scale({
                imperial: false,
                metric: true,
            })
            .addTo(map);

        scaleControl.setPosition("topright");
        return scaleControl;
    },
    printer(map, el) {
        const Printer = L.Control.extend({
            options: {
                position: "bottomright",
            },
            onAdd() {
                return el;
            },
        });
        const control = new Printer();
        map.addControl(control);
        return control;
    },
    cadastreToggler(map, el) {
        const CadastreToggler = L.Control.extend({
            options: {
                position: "bottomleft",
            },

            onAdd() {
                return el;
            },
        });

        const control = new CadastreToggler();
        map.addControl(control);
        return control;
    },
    addressToggler(map, el) {
        const AddressToggler = L.Control.extend({
            options: {
                position: "bottomleft",
            },

            onAdd() {
                return el;
            },
        });

        const control = new AddressToggler();
        map.addControl(control);
        return control;
    },
    fieldTypes(map, el) {
        const Legend = L.Control.extend({
            options: {
                position: "bottomleft",
            },

            onAdd() {
                return el;
            },
        });

        const control = new Legend();
        map.addControl(control);
        return control;
    },
};
