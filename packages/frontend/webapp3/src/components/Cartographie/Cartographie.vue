<template>
    <div class="flex">
        <div class="bg-white border-t w-72">
            <CartographieFiltres />
        </div>
        <div class="flex-1" style="height: 100vh">
            <Carte ref="cartographie" :loading="townsStore.isLoading" :towns="mapStore.filteredTowns"
                displayShantytownsLevel />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useMapStore } from "@/stores/map.store";
import { useTownsStore } from "@/stores/towns.store";

import Carte from "@/components/Carte/Carte.vue";
import CartographieFiltres from "./CartographieFiltres.vue";

const mapStore = useMapStore();
const townsStore = useTownsStore();
const cartographie = ref(null);

onMounted(() => {
    window.scrollTo(0, cartographie.value.$el.offsetTop);
});
</script>
