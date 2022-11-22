<template>
    <div class="py-4" :class="border ? 'border-t-1 border-G200' : ''">
        <slot />
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    border: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const { border } = toRefs(props);
</script>
