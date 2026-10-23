<template>
    <DsfrButton
        v-if="user.status === 'inactive' && user.anonymized_at === null"
        :secondary="!user.anonymization_requested"
        :primary="user.anonymization_requested"
        :icon="
            user.anonymization_requested ? 'mdi:incognito-off' : 'mdi:incognito'
        "
        :loading="isLoading"
        :disabled="disabled"
        >{{ buttonLabel }}</DsfrButton
    >
</template>
<script setup>
import { computed, toRefs } from "vue";

const props = defineProps({
    user: Object,
    isLoading: Boolean,
    disabled: Boolean,
});
const { user, isLoading, disabled } = toRefs(props);

const buttonLabel = computed(() => {
    return user.value.anonymization_requested
        ? "Annuler l'anonymisation"
        : "Anonymiser l'utilisateur";
});
</script>
