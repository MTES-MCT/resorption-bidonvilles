<template>
    <FicheSiteCaracteristiquesGrille :border="false">
        <template v-slot:col1>
            <p class="font-bold">Installé depuis</p>
            <p>
                <template v-if="town.builtAt"
                    >{{ formatDateSince(town.builtAt) }}<br />
                    {{ formatDate(town.builtAt) }}</template
                >
                <template v-else>non communiquée</template>
            </p>
        </template>

        <template v-slot:col2>
            <p class="font-bold">Signalé depuis</p>
            <p>
                <template v-if="town.declaredAt"
                    >{{ formatDateSince(town.declaredAt) }}<br />
                    {{ formatDate(town.declaredAt) }}</template
                >
                <template v-else>non communiquée</template>
            </p>
        </template>
    </FicheSiteCaracteristiquesGrille>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import formatDate from "@/utils/formatDate";
import formatDateSince from "@/utils/formatDateSince";
import FicheSiteCaracteristiquesGrille from "./FicheSiteCaracteristiquesGrille.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
