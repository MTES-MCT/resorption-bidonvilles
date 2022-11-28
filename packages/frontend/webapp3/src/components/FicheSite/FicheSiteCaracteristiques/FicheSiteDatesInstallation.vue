<template>
    <FicheGrille :border="false" :marginTop="false">
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
    </FicheGrille>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import formatDate from "@/utils/formatDate";
import formatDateSince from "@/utils/formatDateSince";
import FicheGrille from "@/components/FicheRubrique/FicheGrille.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
