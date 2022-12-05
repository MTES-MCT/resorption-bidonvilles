<template>
    <Button
        v-if="user.status === 'new' && user.user_accesses.length === 0"
        variant="primary"
        icon="ban"
        iconPosition="left"
        :loading="isLoading"
        :disabled="disabled"
        >Refuser l'accès</Button
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
