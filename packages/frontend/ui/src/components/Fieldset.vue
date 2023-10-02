<template>
    <fieldset>
        <legend class="font-bold text-xl mb-2">
            {{ legend }}
            <MandatoryStar v-if="showMandatoryStar" />
        </legend>
        <slot />
    </fieldset>
</template>
<script setup>
import { MandatoryStar } from "@resorptionbidonvilles/ui";

const props = defineProps({
    legend: {
        type: String,
        required: false,
    },
    showMandatoryStar: {
        type: Boolean,
        required: false,
        default: false,
    },
});
</script>
