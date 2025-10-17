<template>
    <p class="text-sm font-normal">
        {{ town.city.name }}, {{ town.epci.name }} ({{ town.departement.name }})
    </p>
    <div class="flex flex-row gap-2 items-center">
        <h1>{{ town.addressSimple }} ({{ town.departement.code }})</h1>
        <DsfrBadge
            v-if="town.heatwaveStatus"
            label="Alerte canicule"
            type="warning"
        />
    </div>
    <span v-if="town.name" class="text-md">&nbsp; « {{ town.name }} »</span>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
