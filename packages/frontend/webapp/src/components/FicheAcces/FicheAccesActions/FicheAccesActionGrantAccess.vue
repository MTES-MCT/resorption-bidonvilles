<template>
    <Button
        v-if="user.status === 'new'"
        variant="tertiary"
        icon="paper-plane"
        iconPosition="left"
        :loading="isLoading"
        :disabled="disabled"
        >Envoyer un accès</Button
    >
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    user: Object,
    isLoading: Boolean,
    disabled: Boolean,
});
const { user, isLoading, disabled } = toRefs(props);
</script>
