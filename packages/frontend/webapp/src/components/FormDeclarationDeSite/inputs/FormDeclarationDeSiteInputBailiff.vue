<template>
    <TextInput :name="fieldName" :id="fieldName" :label="labels.bailiff" />
</template>

<script setup>
import { toRefs } from "vue";
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";

const props = defineProps({
    fieldName: {
        type: String,
        required: true,
    },
});
const { fieldName } = toRefs(props);
</script>
