<template>
    <FicheSousRubrique :border="false">
        <FicheGrille>
            <template v-slot:col1>
                <Icon icon="calendar" class="mr-2" />
                <span class="font-bold">Débutée le</span>
            </template>

            <template v-slot:col2>
                <span>
                    {{ startedAt }} ({{
                        formatDateSince(plan.started_at / 1000)
                    }})
                </span>
            </template>
        </FicheGrille>

        <FicheGrille v-if="!closedAt && expectedToEndAt">
            <template v-slot:col1>
                <span class="font-bold mt-1">Fin prévue le</span>
            </template>

            <template v-slot:col2>
                <span class="mt-1">{{ expectedToEndAt }}</span>
            </template>
        </FicheGrille>

        <FicheGrille v-if="closedAt">
            <template v-slot:col1>
                <span class="font-bold mt-1">Terminée le</span>
            </template>

            <template v-slot:col2>
                <span class="mt-1">{{ closedAt }}</span>
            </template>
        </FicheGrille>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import formatDateSince from "@/utils/formatDateSince";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import FicheGrille from "@/components/FicheRubrique/FicheGrille.vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

const startedAt = computed(() => {
    return new Date(plan.value.started_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
});
const expectedToEndAt = computed(() => {
    if (!plan.value.expected_to_end_at) {
        return null;
    }

    return new Date(plan.value.expected_to_end_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
});

const closedAt = computed(() => {
    if (!plan.value.closed_at) {
        return null;
    }

    return new Date(plan.value.closed_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
});
</script>
