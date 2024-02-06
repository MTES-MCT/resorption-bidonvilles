<template>
    <div>
        <div v-if="shantytown.populationTotal === null" class="font-bold">
            Population : inconnu
        </div>
        <NombreHabitants
            v-else
            class="text-lg font-bold"
            :population="shantytown.populationTotal"
        />
        <div>
            <div v-if="!socialOrigins.length" class="text-G700">
                Origine : inconnu
            </div>
            <div
                class="flex"
                v-for="origin in socialOrigins"
                v-else
                :key="origin.id"
            >
                <img :src="origin.img" class="w-6 h-4 mr-2 mt-1" alt="" />
                <div>
                    <span class="sr-only">Origine de la population:</span
                    >{{ origin.label }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import NombreHabitants from "@/components/NombreHabitants/NombreHabitants.vue";

import flagEU from "@/assets/img/flags/eu.png";
import flagFR from "@/assets/img/flags/fr.png";
import flagExtraCommunautaires from "@/assets/img/flags/extra-communautaires.png";

const props = defineProps({
    shantytown: Object,
});
const { shantytown } = toRefs(props);

const socialOrigins = computed(() => {
    return shantytown.value.socialOrigins.map((origin) => {
        if (origin.id === 1) {
            return { id: 1, label: "Français", img: flagFR };
        }

        if (origin.id === 2) {
            return { id: 2, label: "Union européenne", img: flagEU };
        }

        if (origin.id === 3) {
            return {
                id: 3,
                label: "Hors Union européenne",
                img: flagExtraCommunautaires,
            };
        }

        return origin;
    });
});
</script>
