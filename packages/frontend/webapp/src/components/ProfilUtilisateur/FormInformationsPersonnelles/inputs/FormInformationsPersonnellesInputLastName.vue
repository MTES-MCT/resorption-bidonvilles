<template>
    <TextInput name="last_name" :label="labels.last_name" :value="value" />
</template>

<script setup>
// utils
import { defineProps, toRefs } from "vue";
import labels from "../FormInformationsPersonnelles.labels";

// components
import { TextInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    default: {
        type: String,
        required: false,
        default: "",
    },
});

const { default: value } = toRefs(props);
</script>
