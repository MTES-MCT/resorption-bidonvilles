<template>
    <FicheGrille>
        <template v-slot:col1>
            <p class="font-bold">Type de site</p>
        </template>

        <template v-slot:col2>
            <Icon
                icon="map-marker-alt"
                class="text-lg mr-2"
                :style="`color: ${town.fieldType.color}`"
            />
            {{ town.fieldType.label }}
        </template>
    </FicheGrille>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { Icon } from "@resorptionbidonvilles/ui";
import FicheGrille from "@/components/FicheRubrique/FicheGrille.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
