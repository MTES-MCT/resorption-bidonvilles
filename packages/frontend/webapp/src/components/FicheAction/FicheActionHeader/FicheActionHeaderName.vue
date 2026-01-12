<template>
    <span class="text-sm font-normal">
        {{ action.location.departement.name }} </span
    ><br />
    <span> {{ action.name }} - {{ action.displayId }} </span>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
</script>
