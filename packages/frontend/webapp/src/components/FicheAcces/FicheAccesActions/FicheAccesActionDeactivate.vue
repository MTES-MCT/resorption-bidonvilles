<template>
    <Button
        v-if="isExpired || user.status === 'active'"
        variant="primary"
        icon="user-slash"
        iconPosition="left"
        :loading="isLoading"
        :disabled="disabled"
        >{{ isExpired ? "Supprimer l'accès" : "Désactiver l'accès" }}</Button
    >
</template>

<script setup>
import { toRefs, computed } from "vue";
import isUserAccessExpired from "@/utils/isUserAccessExpired";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    user: Object,
    isLoading: Boolean,
    disabled: Boolean,
});
const { user, isLoading, disabled } = toRefs(props);

const isExpired = computed(() => {
    return isUserAccessExpired(user.value);
});
</script>
