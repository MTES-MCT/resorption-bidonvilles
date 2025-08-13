<template>
    <DsfrButton
        v-if="
            userStore.user?.is_superuser &&
            user.role_id !== 'local_admin' &&
            user.status !== 'inactive' &&
            user.status !== 'refused'
        "
        secondary
        :loading="isLoading"
        :disabled="disabled"
        >Définir comme « Administrateur local »
    </DsfrButton>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
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
