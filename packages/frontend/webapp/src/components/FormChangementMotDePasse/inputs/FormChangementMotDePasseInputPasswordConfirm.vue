<template>
    <PasswordInput id="password_confirm" :label="label" />
</template>

<script setup>
import { PasswordInput } from "@resorptionbidonvilles/ui";
import labels from "../FormChangementMotDePasse.labels.js";

const { password_confirm: label } = labels;
</script>
