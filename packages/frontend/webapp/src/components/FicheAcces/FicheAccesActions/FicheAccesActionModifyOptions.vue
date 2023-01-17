<template>
    <Button
        v-if="!['inactive', 'new'].includes(user.status)"
        variant="tertiary"
        icon="paper-plane"
        iconPosition="left"
        :loading="isLoading"
        :disabled="disabled"
        >Modifier les options de cet utilisateur</Button
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
