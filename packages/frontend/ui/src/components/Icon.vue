<template>
    <span class="inline-block">
        <i :class="classes" :title="title" aria-hidden="true"></i>
    </span>
</template>

<script setup>
import { toRefs, computed } from "vue"

defineOptions({
    name: "RbIcon",
})
const props = defineProps({
    icon: {
        type: [String, Array],
        required: true
    },
    spin: {
        type: Boolean
    },
    title: {
        type: String,
        required: false
    }
})
const { icon, spin, title } = toRefs(props);

const iconFull = computed(() => {
    if (Array.isArray(icon.value)) {
        return icon.value.join(" ");
    }
    if (!icon.value || typeof icon.value !== 'string') {
        return "fa-solid fa-question";
    }
    return icon.value.includes("fa-") ? icon.value : `fa-solid fa-${icon.value}`;
})

const classes = computed(() => {
    return iconFull.value + (spin.value ? " fa-spin" : "");
})
</script>
