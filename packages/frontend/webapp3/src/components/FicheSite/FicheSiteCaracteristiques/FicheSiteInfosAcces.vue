<template>
    <FicheSiteCaracteristiquesGrille>
        <template v-slot:col1>
            <p class="font-bold">Informations d'accès</p>
        </template>

        <template v-slot:col2>
            {{ town.addressDetails }}
        </template>
    </FicheSiteCaracteristiquesGrille>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheSiteCaracteristiquesGrille from "./FicheSiteCaracteristiquesGrille.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
