<template>
    <DsfrButton
        v-if="user.status === 'inactive' && user.anonymized_at === null"
        primary
        icon="mdi:account-check"
        :loading="isLoading"
        :disabled="disabled"
        >Réactiver l'accès</DsfrButton
    >
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    user: Object,
    isLoading: Boolean,
    disabled: Boolean,
});
const { user, isLoading, disabled } = toRefs(props);
</script>
