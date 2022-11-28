<template>
    <FicheRubrique title="Lieu" id="localisation">
        <FicheSousRubrique>
            <p>
                <Icon icon="map-pin" class="mr-2" />
                <span class="font-bold">{{ plan.location_type.label }}</span>
            </p>

            <FicheActionLocalisationAdresse
                v-if="plan.location_type.id === 'location'"
                :plan="plan"
            />
            <FicheActionLocalisationSites
                class="mt-4"
                v-if="plan.location_type.id === 'shantytowns'"
                :plan="plan"
            />
            <FicheActionLocalisationDivers
                v-if="plan.location_type.id === 'other'"
                :plan="plan"
            />
        </FicheSousRubrique>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { Icon } from "@resorptionbidonvilles/ui";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import FicheActionLocalisationAdresse from "./FicheActionLocalisationAdresse.vue";
import FicheActionLocalisationSites from "./FicheActionLocalisationSites.vue";
import FicheActionLocalisationDivers from "./FicheActionLocalisationDivers.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
