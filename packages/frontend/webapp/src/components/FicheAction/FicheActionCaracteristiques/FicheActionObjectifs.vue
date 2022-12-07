<template>
    <FicheSousRubrique>
        <p>
            <Icon icon="bullseye" class="mr-2" />
            <span class="font-bold">Objectifs de l'intervention</span>
        </p>
        <p class="whitespace-pre-line">
            <template v-if="showAll">{{ plan.goals }}</template>
            <template v-else>
                {{ plan.goals.substr(0, 300) }} [...]<br /><br />
                <Link withStyle @click="showAll = true"
                    >[...] Lire la suite</Link
                >
            </template>
        </p>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import { Icon, Link } from "@resorptionbidonvilles/ui";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
const showAll = ref(plan.value.goals.length < 300);
</script>
