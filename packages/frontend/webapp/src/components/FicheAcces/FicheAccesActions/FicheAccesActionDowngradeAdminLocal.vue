<template>
    <DsfrButton
        v-if="
            userStore.user?.is_superuser &&
            user.role_id === 'local_admin' &&
            user.status !== 'inactive'
        "
        :icon="
            isLoading
                ? {
                      name: 'ri:loader-4-line',
                      animation: 'spin',
                  }
                : null
        "
        secondary
        :loading="isLoading"
        :disabled="disabled || isLoading"
        >Retirer le rôle « Administrateur local »
    </DsfrButton>
</template>

<script setup>
import { toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";

const props = defineProps({
    user: Object,
    isLoading: Boolean,
    disabled: Boolean,
});
const { user, isLoading, disabled } = toRefs(props);
const userStore = useUserStore();
</script>
