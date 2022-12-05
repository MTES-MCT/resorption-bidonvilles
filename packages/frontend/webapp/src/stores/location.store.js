import { defineStore } from "pinia";
import { get } from "@/api/geo.api";
import formatLocationLabel from "@/utils/formatLocationLabel";

export const useLocationStore = defineStore("location", {
    state: () => ({
        locations: {},
    }),

    actions: {
        saveLocation(value) {
            const { type, code } = value.data;
            if (!this.locations[type]) {
                this.locations[type] = {};
            }

            this.locations[type][code] = value;
        },

        async fetchLocation(type, code) {
            if (this.locations[type]?.[code]) {
                return this.locations[type][code];
            }

            const location = await get(type, code);
            const locationDetails = location[type];

            this.saveLocation({
                label: formatLocationLabel(locationDetails),
                data: {
                    code,
                    departement: location.departement?.code,
                    typeName: "-",
                    typeUid: type,
                },
            });
        },
    },
});
