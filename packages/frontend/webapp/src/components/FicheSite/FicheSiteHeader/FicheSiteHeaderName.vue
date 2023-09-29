<template>
    <p class="text-sm font-normal">
        {{ town.city.name }}, {{ town.epci.name }} ({{ town.departement.name }})
    </p>
    <h1>{{ town.addressSimple }}</h1>
    <span v-if="town.name" class="text-md">&nbsp; « {{ town.name }} »</span>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
