<template>
    <img :src="locationImg" class="w-36" alt="" />
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import departementsImg from "@/assets/img/departements/export.js";
import regionsImg from "@/assets/img/regions/export.js";

const props = defineProps({
    location: {
        type: Object,
        required: true,
    },
});
const { location } = toRefs(props);

const locationImg = computed(() => {
    // location inconnue
    if (!location.value) {
        return regionsImg.fallback;
    }

    // national et hexagone
    if (["nation", "metropole"].includes(location.value.typeUid)) {
        return regionsImg.france;
    }

    // outremer
    if (location.value?.typeUid === "outremer") {
        return regionsImg.outremer;
    }

    // régional
    if (location.value?.typeUid === "region") {
        const unsupportedRegions = ["01", "02", "03", "04", "06"];
        if (
            unsupportedRegions.includes(location.value.code) ||
            !regionsImg[location.value.code]
        ) {
            return regionsImg.fallback;
        }

        return regionsImg[location.value.code];
    }

    // départemental
    if (
        !location.value?.departement ||
        !departementsImg[location.value.departement]
    ) {
        return regionsImg.fallback;
    }

    return departementsImg[location.value.departement];
});
</script>
