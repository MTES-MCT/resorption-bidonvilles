<template>
    <p>{{ action.eti.address }}</p>
    <div class="h-128">
        <Carte
            defaultLayer="Satellite"
            :defaultView="center"
            :towns="[action.eti]"
            @townclick="onTownClick"
        />
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import router from "@/helpers/router";
import Carte from "@/components/Carte/Carte.vue";

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

function onTownClick(town) {
    router.push(`/site/${town.id}`);
}
</script>
