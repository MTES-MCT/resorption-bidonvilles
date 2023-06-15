import L from "leaflet";

export default (level, location) => {
    const { code, total, latitude, longitude } = location;
    return L.marker([latitude, longitude], {
        icon: L.divIcon({
            className: "my-marker",
            html: `<span id="marqueur-${level}-stats-${code}" class="bg-primary text-white rounded p-2 text-sm">${total}</span>`,
            iconSize: [20, 20],
        }),
    });
};
