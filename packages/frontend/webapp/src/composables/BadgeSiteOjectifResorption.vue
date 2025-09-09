<template>
    <DsfrBadge
        v-if="resorptionTarget"
        :noIcon="noicon"
        :label="objectifResorptionLabel(resorptionTarget)"
        type="info"
        class="mt-1 text-xs py-2 mr-2"
    />
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
    resorptionTarget: {
        type: String,
        default: null,
    },
    noicon: {
        type: Boolean,
        default: false,
    },
});

function objectifResorptionLabel(target) {
    return `Objectif résorption ${target} par la Préfecture`;
}
</script>
