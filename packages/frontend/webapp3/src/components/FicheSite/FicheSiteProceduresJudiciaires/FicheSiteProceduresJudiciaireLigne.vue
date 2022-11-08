<template>
    <FicheSiteSousRubrique>
        <div class="grid grid-template items-center">
            <p v-if="icon" class="text-center"><Icon :icon="icon" /></p>
            <p v-else></p>
            <p class="font-bold">{{ label }}</p>
            <p><slot /></p>
        </div>
    </FicheSiteSousRubrique>
</template>

<style scoped>
.grid-template {
    grid-template-columns: 30px min(300px, 60%) auto;
}
</style>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheSiteSousRubrique from "../FicheSiteSousRubrique.vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    icon: {
        type: String,
        required: false,
    },
    label: {
        type: String,
        required: true,
    },
});
const { icon, label } = toRefs(props);
</script>
