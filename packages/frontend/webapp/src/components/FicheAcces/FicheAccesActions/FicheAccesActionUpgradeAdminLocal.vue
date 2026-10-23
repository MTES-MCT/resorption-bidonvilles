<template>
    <DsfrButton
        v-if="
            userStore.user?.is_superuser &&
            user.role_id !== 'local_admin' &&
            user.status !== 'inactive' &&
            user.status !== 'refused'
        "
        secondary
        :icon="
            isLoading
                ? {
                      name: 'ri:loader-4-line',
                      animation: 'spin',
                  }
                : null
        "
        :loading="isLoading"
        :disabled="disabled || isLoading"
        >Définir comme « Administrateur local »
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

<style scoped>
button {
    border: inherit;
}
</style>
