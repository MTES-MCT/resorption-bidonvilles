<template>
    <TextInput id="first_name" :label="label" />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormInvitation.labels.js";

const { first_name: label } = labels;
</script>
