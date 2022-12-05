<template>
    <li
        class="inline-block align-top pl-4 cursor-pointer"
        :class="
            active ? 'font-bold text-primary' : 'underline hover:no-underline'
        "
    >
        <slot />
    </li>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    active: {
        type: Boolean,
        required: true,
    },
});
const { active } = toRefs(props);
</script>
