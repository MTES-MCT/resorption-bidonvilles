<template>
    <div>
        <label :class="`font-bold text-${size}`" :for="id ? id : null">
            {{ title }}
            <MandatoryStar v-if="showMandatoryStar" />
            <span class="text-G700" v-if="info">{{ info }}</span>
        </label>
        <p class="mt-1 mb-4">
            <slot />
        </p>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { MandatoryStar } from "@resorptionbidonvilles/ui";

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    info: {
        type: String,
        required: false,
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
const { title, info, showMandatoryStar, size } = toRefs(props);
</script>
