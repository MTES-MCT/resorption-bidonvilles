<template>
    <Link :to="to" :ariaLabel="ariaLabel"
        ><Icon icon="address-book" /> <slot /></Link
    >
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import Link from "./Link.vue";
import Icon from "./Icon.vue";

const props = defineProps({
    to: String,
    ariaLabel : {
        type: String,
        required: false,
    },        
});
const { to } = toRefs(props);
</script>
