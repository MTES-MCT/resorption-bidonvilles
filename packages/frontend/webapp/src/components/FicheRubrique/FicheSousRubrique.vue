<template>
    <div
        class="pt-4"
        :class="{
            'border-t-1 border-G200': border === true,
            'mt-4': marginTop === true,
        }"
    >
        <slot />
    </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    border: {
        type: Boolean,
        required: false,
        default: true,
    },
    marginTop: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const { border, marginTop } = toRefs(props);
</script>
