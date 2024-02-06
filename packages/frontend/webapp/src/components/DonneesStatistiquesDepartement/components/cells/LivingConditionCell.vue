<template>
    <Icon v-if="value !== 'unknown'" :icon="icon" :class="color" />
    <span v-else class="text-G700">?</span>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({ value: Boolean });
const { value } = toRefs(props);

const icon = computed(() => {
    switch (value.value) {
        case "good":
            return "check";
        case "bad":
            return "times";
        default:
            return "exclamation-triangle";
    }
});

const color = computed(() => {
    switch (value.value) {
        case "good":
            return "text-success";
        case "bad":
            return "text-error";
        default:
            return "text-secondary";
    }
});
</script>
