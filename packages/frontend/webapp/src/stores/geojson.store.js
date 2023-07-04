import { defineStore } from "pinia";
import { ref } from "vue";
import { departement } from "@/api/geojson.api";

export const useGeojsonStore = defineStore("geojson", () => {
    const departements = ref({});

    return {
        async getDepartement(code) {
            if (!departements.value[code]) {
                departements.value[code] = await departement(code);
            }

            return departements.value[code];
        },
    };
});
