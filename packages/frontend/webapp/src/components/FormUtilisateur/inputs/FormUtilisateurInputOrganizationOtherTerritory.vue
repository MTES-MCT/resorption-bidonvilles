<template>
    <TextInput id="organization_other_territory" :label="label" />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);
</script>
