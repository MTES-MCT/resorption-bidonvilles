<template>
    <Icon :icon="icon" :class="color" />
</template>

<script setup>
import { computed, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({ value: Boolean });
const { value } = toRefs(props);

const icon = computed(() => {
    if (typeof value.value !== "boolean") {
        return "question";
    }

    return value.value ? "check" : "times";
});

const color = computed(() => {
    if (typeof value.value !== "boolean") {
        return "text-G500";
    }

    return value.value ? "text-success" : "text-error";
});
</script>
