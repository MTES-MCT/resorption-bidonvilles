<template>
    <Button
        v-if="
            userStore.user?.is_superuser &&
            user.role_id === 'local_admin' &&
            user.status !== 'inactive'
        "
        variant="primaryOutline"
        :loading="isLoading"
        :disabled="disabled"
        >Retirer rôle « Administrateur local »
    </Button>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    user: Object,
    isLoading: Boolean,
    disabled: Boolean,
});
const { user, isLoading, disabled } = toRefs(props);
const userStore = useUserStore();
</script>
