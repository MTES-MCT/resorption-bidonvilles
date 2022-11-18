<template>
    <TextInput id="email" :label="label" :disabled="true" />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormActivationCompte.labels.js";

const { email: label } = labels;
</script>
