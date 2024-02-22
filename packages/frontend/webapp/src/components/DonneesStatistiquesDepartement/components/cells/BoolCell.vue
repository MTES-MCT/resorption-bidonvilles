<template>
    <Icon v-if="typeof value === 'boolean'" :icon="icon" :class="color" />
    <span v-else class="text-G700">?</span>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({ value: Boolean });
const { value } = toRefs(props);

const icon = computed(() => {
    return value.value ? "check" : "times";
});

const color = computed(() => {
    return value.value ? "text-success" : "text-error";
});
</script>
