<template>
    <section>
        <FicheGrille>
            <template v-slot:col1>
                <Icon icon="calendar" class="mr-2" />
                <span class="font-bold">Débutée le</span>
            </template>

            <template v-slot:col2>
                {{ formatDate(plan.started_at / 1000, "d M y") }} ({{
                    formatDateSince(plan.started_at / 1000)
                }})
            </template>
        </FicheGrille>

        <FicheGrille v-if="!plan.closed_at && plan.expected_to_end_at">
            <template v-slot:col1>
                <span class="font-bold">Fin prévue le</span>
            </template>

            <template v-slot:col2>
                {{ formatDate(plan.expected_to_end_at / 1000, "d M y") }}
            </template>
        </FicheGrille>

        <FicheGrille v-if="plan.closed_at">
            <template v-slot:col1>
                <span class="font-bold">Terminée le</span>
            </template>

            <template v-slot:col2>
                {{ formatDate(plan.closed_at / 1000, "d M y") }}
            </template>
        </FicheGrille>
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import formatDate from "@/utils/formatDate";
import formatDateSince from "@/utils/formatDateSince";

import FicheGrille from "@/components/FicheRubrique/FicheGrille.vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
