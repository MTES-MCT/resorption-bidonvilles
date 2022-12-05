<template>
    <PasswordInput id="password" :label="label" :info="wording.passwordInfo" />
</template>

<script setup>
import { PasswordInput } from "@resorptionbidonvilles/ui";
import labels from "../FormActivationCompte.labels.js";
import wording from "@/utils/wording.js";

const { password: label } = labels;
</script>
