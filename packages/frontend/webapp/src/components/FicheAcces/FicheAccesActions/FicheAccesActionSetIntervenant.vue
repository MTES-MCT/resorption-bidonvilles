<template>
    <DsfrButton
        v-if="
            userStore.user?.is_admin &&
            !userStore.user?.is_superuser &&
            !user.is_admin &&
            user.role_id !== 'intervener' &&
            user.status !== 'inactive' &&
            user.status !== 'refused'
        "
        :loading="isLoading"
        :disabled="disabled"
        secondary
        >Définir comme « Intervenant »
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
