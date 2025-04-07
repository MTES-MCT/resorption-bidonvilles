<template>
    <Button
        v-if="user.status === 'inactive' && !user.anonymized"
        variant="primary"
        icon="user-check"
        iconPosition="left"
        :loading="isLoading"
        :disabled="disabled"
        >Réactiver l'accès</Button
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
