<template>
    <DsfrButton
        v-if="user.status === 'inactive' && user.anonymized_at === null"
        primary
        :icon="
            isLoading
                ? {
                      name: 'ri:loader-4-line',
                      animation: 'spin',
                  }
                : 'mdi:account-check'
        "
        :disabled="disabled || isLoading"
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
