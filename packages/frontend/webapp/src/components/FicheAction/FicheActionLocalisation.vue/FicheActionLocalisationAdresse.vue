<template>
    <div v-if="action.eti && action.eti.length > 0">
        <div v-if="action.eti.length === 1" class="mb-8">
            <p>{{ action.eti[0].address }}</p>
        </div>
        <div v-else class="mt-2 mb-8">
            <p class="font-bold mb-2">{{ action.eti.length }} adresses :</p>
            <ul class="mb-4">
                <li
                    v-for="(address, index) in action.eti"
                    :key="index"
                    class="pl-6"
                >
                    <VIcon name="ri-focus-3-fill" class="mr-2" />
                    {{ address.address }}
                </li>
            </ul>
        </div>

        <div class="h-128 mb-8">
            <CartoFicheAction :defaultView="center" :towns="action.eti" />
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import CartoFicheAction from "@/components/CartoFicheAction/CartoFicheAction.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);

const center = computed(() => {
    if (!action.value.eti || action.value.eti.length === 0) {
        return { center: [0, 0], zoom: 15 };
    }

    // Si une seule adresse, centrer dessus
    if (action.value.eti.length === 1) {
        return {
            center: [
                action.value.eti[0].latitude,
                action.value.eti[0].longitude,
            ],
            zoom: 15,
        };
    }

    // Si plusieurs adresses, calculer le centre géographique
    const latitudes = action.value.eti.map((addr) => addr.latitude);
    const longitudes = action.value.eti.map((addr) => addr.longitude);

    const centerLat =
        latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
    const centerLng =
        longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;

    return {
        center: [centerLat, centerLng],
        zoom: 13,
    };
});
</script>
