<template>
    <FicheGrille>
        <template v-slot:col1>
            <p class="font-bold">Informations d'accès</p>
        </template>

        <template v-slot:col2>
            <p class="whitespace-pre-line break-words">
                {{ town.addressDetails }}
            </p>
        </template>
    </FicheGrille>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheGrille from "@/components/FicheRubrique/FicheGrille.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
