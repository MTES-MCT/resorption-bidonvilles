<template>
    <DsfrButton
        v-if="userStore.user?.is_superuser && hasPendingAccess"
        primary
        :loading="isLoading"
        :disabled="disabled"
        >Copier le lien d'activation</DsfrButton
    >
</template>

<script setup>
import { toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";

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
