<template>
    <PasswordInput id="password" :label="label" autocomplete="password" />
</template>

<script setup>
import { PasswordInput } from "@resorptionbidonvilles/ui";
import labels from "../FormConnexion.labels.js";

const { password: label } = labels;
</script>
