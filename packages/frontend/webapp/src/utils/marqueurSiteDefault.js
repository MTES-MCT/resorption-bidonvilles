import L from "leaflet";

export default (town) => L.marker([town.latitude, town.longitude]);
