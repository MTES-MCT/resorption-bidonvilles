<template>
    <PasswordInput
        name="password"
        :label="labels.password"
        :info="wording.passwordInfo"
    />
</template>

<script setup>
// utils
import labels from "../FormIdentifiants.labels";
import wording from "@/utils/wording.js";

// components
import { PasswordInput } from "@resorptionbidonvilles/ui";
</script>
