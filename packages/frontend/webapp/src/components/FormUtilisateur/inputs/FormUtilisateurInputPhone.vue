<template>
    <TextInput id="phone" :label="label" />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import { toRefs } from "vue";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);
</script>
