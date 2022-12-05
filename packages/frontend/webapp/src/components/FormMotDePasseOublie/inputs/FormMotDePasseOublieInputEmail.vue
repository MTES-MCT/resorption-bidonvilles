<template>
    <TextInput
        id="email"
        :label="label"
        info="Le courriel que vous utilisez pour accéder à la plateforme"
        placeholder="marcel.dupont@exemple.fr"
    />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormMotDePasseOublie.labels.js";

const { email: label } = labels;
</script>
