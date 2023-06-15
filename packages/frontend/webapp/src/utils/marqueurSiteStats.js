import L from "leaflet";

export default (town) => {
    return L.marker([town.latitude, town.longitude], {
        icon: L.divIcon({
            className: "my-marker",
            html: `<span class="border-2 border-primary rounded bg-white px-2 py-1">
                ${town.number_of_persons || "0"}
            </span>`,
        }),
    });
};
