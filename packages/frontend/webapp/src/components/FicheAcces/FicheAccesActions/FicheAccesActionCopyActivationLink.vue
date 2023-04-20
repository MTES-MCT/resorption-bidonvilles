<template>
    <Button
        v-if="userStore.user?.is_superuser && hasPendingAccess"
        variant="primaryOutline"
        :loading="isLoading"
        :disabled="disabled"
        >Copier le lien d'activation</Button
    >
</template>

<script setup>
import { toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    user: Object,
    isLoading: Boolean,
    disabled: Boolean,
});
const { user, isLoading, disabled } = toRefs(props);
const userStore = useUserStore();

const hasPendingAccess = computed(() => {
    const now = Date.now();

    return (
        user.value?.status === "new" &&
        user.value?.user_accesses.length > 0 &&
        user.value?.user_accesses[0].expires_at * 1000 - now > 0
    );
});
</script>
