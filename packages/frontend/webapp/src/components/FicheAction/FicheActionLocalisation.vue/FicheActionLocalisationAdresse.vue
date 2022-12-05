<template>
    <p>{{ plan.location.label }}</p>
    <div class="h-128">
        <Carte
            defaultLayer="Satellite"
            :defaultView="center"
            :towns="[address]"
            @townclick="onTownClick"
        />
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import router from "@/helpers/router";
import Carte from "@/components/Carte/Carte.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

const address = computed(() => {
    return {
        latitude: plan.value.location.latitude,
        longitude: plan.value.location.longitude,
        address: plan.value.location.label,
    };
});

const center = computed(() => {
    return {
        center: [plan.value.location.latitude, plan.value.location.longitude],
        zoom: 15,
    };
});

function onTownClick(town) {
    router.push(`/site/${town.id}`);
}
</script>
