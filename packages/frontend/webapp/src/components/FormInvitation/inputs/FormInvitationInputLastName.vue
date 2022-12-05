<template>
    <TextInput id="last_name" :label="label" />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormInvitation.labels.js";

const { last_name: label } = labels;
</script>
