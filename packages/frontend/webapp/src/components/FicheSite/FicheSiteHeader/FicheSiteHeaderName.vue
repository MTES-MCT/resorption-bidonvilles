<template>
    <span class="text-sm font-normal"
        >{{ town.city.name }} ({{ town.departement.name }})</span
    ><br />
    <span>{{ town.addressSimple }}</span>
    <span v-if="town.name" class="text-md">&nbsp; « {{ town.name }} »</span>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
