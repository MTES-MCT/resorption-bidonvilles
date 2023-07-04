import L from "leaflet";

export default () =>
    L.marker([46.7755829, 2.0497727], {
        title: "Recherche",
        icon: L.divIcon({
            className: "my-marker",
            html: `<div class="w-6 relative">
            <div
                class="bg-white rounded-full w-6 h-6 border-2 flex items-center justify-center"
                style="border: 3px solid #ff0000"
                ></div>
            <div
                class="-mt-[1px] w-3 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 m-auto"
                style="border-top-color: #ff0000"
            ></div>
        </div>`,
            iconAnchor: [13, 28],
        }),
    });
