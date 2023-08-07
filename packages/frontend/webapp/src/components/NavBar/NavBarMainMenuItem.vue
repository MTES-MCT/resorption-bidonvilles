<template>
    <router-link
        :to="to"
        class="py-3 px-6 hover:bg-G100 border-t-2 border-b-2 border-transparent focus:outline-none focus:ring-2 ring-offset-2 ring-info"
        v-bind:class="active ? 'border-b-primary text-primary' : ''"
        tabindex="0"
    >
        <slot />
    </router-link>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

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
