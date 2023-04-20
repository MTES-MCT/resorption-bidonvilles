<template>
    <TextInput name="position" :label="labels.position" :value="value" />
</template>

<script setup>
// utils
import { toRefs } from "vue";
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
