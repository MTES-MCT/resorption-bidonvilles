<template>
    <FicheSiteCaracteristiquesGrille>
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
    </FicheSiteCaracteristiquesGrille>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { Icon } from "@resorptionbidonvilles/ui";
import FicheSiteCaracteristiquesGrille from "./FicheSiteCaracteristiquesGrille.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
