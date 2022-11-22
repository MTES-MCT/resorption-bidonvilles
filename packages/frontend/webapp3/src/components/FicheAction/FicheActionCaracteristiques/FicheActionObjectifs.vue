<template>
    <FicheSousRubrique>
        <section>
            <Icon icon="bullseye" class="mr-2" />
            <span class="font-bold">Objectifs de l'intervention</span>
            <p class="whitespace-pre-line">{{ plan.goals }}</p>
        </section>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
