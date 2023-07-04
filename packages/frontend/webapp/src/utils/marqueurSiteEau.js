import { computed } from "vue";
import L from "leaflet";
import { useConfigStore } from "@/stores/config.store";

import waterYes from "@/assets/img/map/water-yes.png";
import waterNo from "@/assets/img/map/water-no.png";
import waterToImprove from "@/assets/img/map/water-to-improve.png";
import waterNull from "@/assets/img/map/water-null.png";

const configStore = useConfigStore();
const waterImages = {
    unknown: waterNull,
    [undefined]: waterNull,
    good: waterYes,
    bad: waterNo,
    toImprove: waterToImprove,
};

const fieldTypeColors = computed(() => {
    return configStore.config.field_types.reduce((acc, fieldType) => {
        acc[fieldType.id] = fieldType.color;
        return acc;
    }, {});
});

export default (town) => {
    const waterImage =
        waterImages[town.livingConditions?.water?.status.status] ||
        waterImages.unknown;
    const color = fieldTypeColors.value[town.fieldType?.id] || "#ff0000";

    return L.marker([town.latitude, town.longitude], {
        icon: L.divIcon({
            className: "my-marker",
            html: `<div class="w-6 relative"${
                town.opacity ? ` style="opacity: ${town.opacity}"` : ""
            }>
                <div
                    class="bg-white rounded-full w-6 h-6 border-2 flex items-center justify-center"
                    style="border: 3px solid ${color}"
                    ><img src="${waterImage}" class="w-4 h-4"
                /></div>
                <div
                    class="-mt-[1px] w-3 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 m-auto"
                    style="border-top-color: ${color}"
                ></div>
                <div class="absolute top-1 left-8 bg-white/75 whitespace-nowrap px-2 rb-map-address">${
                    town.usename
                }</div>
            </div>`,
            iconAnchor: [13, 28],
        }),
    });
};
