<template>
    <div>
        <h1 :class="`font-bold text-${size}`">
            {{ title }}
            <MandatoryStar v-if="showMandatoryStar" />
        </h1>
        <p class="mt-1 mb-4">
            <slot />
        </p>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { MandatoryStar } from "@resorptionbidonvilles/ui";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    showMandatoryStar: {
        type: Boolean,
        required: false,
        default: false,
    },
    size: {
        type: String,
        required: false,
        default: "xl",
    },
});
const { title, showMandatoryStar, size } = toRefs(props);
</script>
