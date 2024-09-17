<template>
    <Icon
        class="text-red600"
        icon="temperature-high"
        v-if="town.heatwave === true"
    />
</template>

<script setup>
import { toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
