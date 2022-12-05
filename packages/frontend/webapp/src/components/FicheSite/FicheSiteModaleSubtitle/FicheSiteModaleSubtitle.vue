<template>
    <Icon icon="map-marker-alt" />
    {{ town.addressSimple }}
    <span v-if="town.name" class="text-display-xs">« {{ town.name }} »</span>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
