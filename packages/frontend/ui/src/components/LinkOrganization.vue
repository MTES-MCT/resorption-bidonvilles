<template>
    <Link :to="to"
        ><Icon icon="address-book" /> <slot /></Link
    >
</template>

<script setup>
import { toRefs } from "vue";
import Link from "./Link.vue";
import Icon from "./Icon.vue";

const props = defineProps({
    to: String
});
const { to } = toRefs(props);
</script>