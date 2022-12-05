import { defineStore } from "pinia";
import { ref } from "vue";
import { list } from "@/api/pois.api";

export const usePoiStore = defineStore("poi", () => {
    const pois = ref([]);

    return {
        pois,
        async fetch() {
            pois.value = await list();
        },
    };
});
