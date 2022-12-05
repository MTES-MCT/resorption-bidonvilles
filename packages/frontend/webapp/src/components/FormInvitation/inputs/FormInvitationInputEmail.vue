<template>
    <TextInput id="email" :label="label" />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormInvitation.labels.js";

const { email: label } = labels;
</script>
