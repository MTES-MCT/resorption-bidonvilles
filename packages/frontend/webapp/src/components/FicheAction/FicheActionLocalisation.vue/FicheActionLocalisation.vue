<template>
    <FicheRubrique title="Lieu" id="localisation">
        <FicheSousRubrique>
            <p>
                <Icon icon="location-dot" class="mr-2" />
                <span class="font-bold">{{ label }}</span>
                <span
                    v-if="action.location_type === 'sur_site'"
                    class="ml-1 font-bold"
                >
                    ({{ action.location_shantytowns?.length || 0 }})
                </span>
            </p>

            <FicheActionLocalisationAdresse
                v-if="action.location_type === 'eti'"
                :action="action"
            />
            <FicheActionLocalisationSites
                class="mt-4"
                v-if="action.location_type === 'sur_site'"
                :action="action"
            />
            <FicheActionLocalisationDivers
                v-if="action.location_type === 'autre'"
                :action="action"
            />
        </FicheSousRubrique>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import locationTypes from "@/utils/action_location_types";

import { Icon } from "@resorptionbidonvilles/ui";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import FicheActionLocalisationAdresse from "./FicheActionLocalisationAdresse.vue";
import FicheActionLocalisationSites from "./FicheActionLocalisationSites.vue";
import FicheActionLocalisationDivers from "./FicheActionLocalisationDivers.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);

const label = computed(() => {
    return locationTypes.find(({ uid }) => uid === action.value.location_type)
        .label;
});
</script>
