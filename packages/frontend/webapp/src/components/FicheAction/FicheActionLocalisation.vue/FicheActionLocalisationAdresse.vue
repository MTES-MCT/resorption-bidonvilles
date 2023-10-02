<template>
    <p>{{ action.eti.address }}</p>
    <div class="h-128">
        <CartoFicheAction inert :defaultView="center" :towns="[action.eti]" />
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
    return {
        center: [action.value.eti.latitude, action.value.eti.longitude],
        zoom: 15,
    };
});
</script>
