<template>
    <PasswordInput
        id="password"
        :label="label"
        :info="user.is_admin ? wording.passwordInfoAdmin : wording.passwordInfo"
    />
</template>

<script setup>
import { toRefs } from "vue";
import { PasswordInput } from "@resorptionbidonvilles/ui";
import labels from "../FormActivationCompte.labels.js";
import wording from "@/utils/wording.js";

const props = defineProps({
    user: Object,
});

const { user } = toRefs(props);

const { password: label } = labels;
</script>
