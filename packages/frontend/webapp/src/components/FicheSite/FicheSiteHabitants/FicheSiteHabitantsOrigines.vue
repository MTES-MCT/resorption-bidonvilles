<template>
    <FicheSousRubrique>
        <p class="font-bold">Origine</p>
        <p v-if="origins.length === 0" class="text-G700">non communiqué</p>
        <template v-else>
            <p
                v-for="origin in origins"
                :key="origin.id"
                class="flex items-center space-x-2"
            >
                <img :src="origin.img" class="w-8" />
                <span class="">{{ origin.label }}</span>
            </p>
        </template>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import flagFR from "@/assets/img/flags/fr.png";
import flagEU from "@/assets/img/flags/eu.png";
import flagExtraCommunautaires from "@/assets/img/flags/extra-communautaires.png";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const FLAGS = {
    french: flagFR,
    european: flagEU,
    other: flagExtraCommunautaires,
};

const origins = computed(() => {
    return town.value.socialOrigins.map(({ id, uid, label }) => {
        return {
            id,
            label,
            img: FLAGS[uid],
        };
    });
});
</script>
