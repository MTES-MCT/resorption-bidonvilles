<template>
    <TextInput
        id="email"
        :label="label"
        placeholder="marcel.dupont@exemple.fr"
    />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormConnexion.labels.js";

const { email: label } = labels;
</script>
