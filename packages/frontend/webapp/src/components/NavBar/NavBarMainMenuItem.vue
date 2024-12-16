<template>
    <router-link
        :to="to"
        class="py-3 px-6 hover:!bg-G100 border-t-2 border-b-2 border-transparent"
        :class="[
            active ? 'border-b-primary text-primary' : '',
            focusClasses.ring,
        ]"
    >
        <slot />
    </router-link>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import focusClasses from "@common/utils/focus_classes";

const props = defineProps({
    to: String,

    active: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const { to } = toRefs(props);
</script>
