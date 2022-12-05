<template>
    <Tag
        :class="['py-1 px-3', isHover ? 'shadow-md' : '']"
        :variant="variant === 'full' ? 'highlight' : 'info'"
        :display="display"
    >
        Objectif résorption
        {{ target }}
        <template v-if="variant === 'full'">par la Préfecture</template>
    </Tag>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    target: {
        type: Number,
        required: true,
    },
    isHover: {
        type: Boolean,
        required: false,
        default: false,
    },
    // see Tag prop 'display'
    display: {
        type: String,
        required: false,
        default: undefined,
    },
    // either 'short' or 'full'
    variant: {
        type: String,
        required: false,
        default: "full",
    },
});
const { target, isHover, display, variant } = toRefs(props);
</script>
