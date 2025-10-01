<template>
    <VIcon
        class="!text-secondary"
        name="ri:sun-fill"
        v-if="town.heatwave === true"
    />
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
