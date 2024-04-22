<template>
    <div
        v-if="user.is_admin"
        class="p-4 bg-yellow-200 mb-4 flex items-start space-x-2"
    >
        <Icon icon="warning" class="text-error" />
        <span
            >Attention, afin d'améliorer la sécurité de la plateforme, en tant
            qu'<strong>{{ user.role.toLowerCase() }}</strong
            >, vous devez choisir un mot de passe fort, dont la
            <strong>longueur minimale est désormais de 16 caractères</strong>.
        </span>
    </div>
    <PasswordInput
        name="actualPassword"
        :label="labels.actualPassword"
        info=""
        :disabled="disabled"
    />
    <PasswordInput
        name="newPassword"
        :label="labels.newPassword"
        :info="user.is_admin ? wording.passwordInfoAdmin : wording.passwordInfo"
        :disabled="disabled"
    />
    <PasswordInput
        name="retypeNewPassword"
        :label="labels.retypeNewPassword"
        info=""
        :disabled="disabled"
    />
</template>

<script setup>
import { toRefs } from "vue";
// utils
import labels from "../FormIdentifiants.labels";
import wording from "@/utils/wording.js";

// components
import { Icon, PasswordInput } from "@resorptionbidonvilles/ui";

const props = defineProps(["user", "disabled"]);
const { user, disabled } = toRefs(props);
</script>
