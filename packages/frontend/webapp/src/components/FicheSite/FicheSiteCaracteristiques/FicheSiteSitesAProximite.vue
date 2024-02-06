<template>
    <FicheGrille>
        <template v-slot:col1>
            <p class="font-bold">Sites à proximité</p>
            <p class="text-sm text-G700">Dans un rayon de 500m</p>
        </template>

        <template v-slot:col2>
            <ul class="list-disc ml-4">
                <li
                    class="text-sm mb-1"
                    v-for="town in towns.slice(0, 5)"
                    :key="town.shantytown_id"
                >
                    <Link :to="`/site/${town.id}`">
                        {{ town.usename }}
                        <span> ({{ town.distance.toFixed(2) }}km)</span>
                    </Link>
                </li>
            </ul>
        </template>
    </FicheGrille>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { Link } from "@resorptionbidonvilles/ui";
import FicheGrille from "@/components/FicheRubrique/FicheGrille.vue";

const props = defineProps({
    towns: Array,
});
const { towns } = toRefs(props);
</script>
