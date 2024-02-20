<template>
    <TextInput id="position" :label="label" showMandatoryStar />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);
</script>
