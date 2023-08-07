<template>
    <FicheSousRubrique>
        <div class="flex items-start">
            <div class="w-8">
                <p v-if="icon" class="text-center"><Icon :icon="icon" /></p>
                <p v-else></p>
            </div>
            <div>
                <p class="font-bold">{{ label }}</p>
                <p><slot /></p>
            </div>
        </div>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
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
