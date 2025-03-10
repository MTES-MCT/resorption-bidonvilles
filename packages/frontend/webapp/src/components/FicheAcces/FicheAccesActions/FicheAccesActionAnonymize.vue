<template>
    <Button
        v-if="user.status === 'inactive' && !user.anonymized"
        :variant="
            user.anonymization_requested ? 'secondaryOutline' : 'primaryOutline'
        "
        icon="user-secret"
        iconPosition="left"
        :loading="isLoading"
        :disabled="disabled"
        class="!border-2"
        :class="[
            user.anonymization_requested
                ? '!border-secondary hover:!bg-secondary'
                : '!border-primary hover:!bg-primary',
        ]"
        >{{ buttonLabel }}</Button
    >
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { Button } from "@resorptionbidonvilles/ui";

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

<style scoped>
button {
    border: inherit;
}
</style>
