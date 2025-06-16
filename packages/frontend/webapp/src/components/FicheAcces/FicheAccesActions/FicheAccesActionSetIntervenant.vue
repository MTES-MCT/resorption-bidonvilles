<template>
    <Button
        v-if="
            userStore.user?.is_admin &&
            !userStore.user?.is_superuser &&
            !user.is_admin &&
            user.role_id !== 'intervener' &&
            user.status !== 'inactive' &&
            user.status !== 'refused'
        "
        variant="primaryOutline"
        :loading="isLoading"
        :disabled="disabled"
        class="!border-2 !border-primary hover:!bg-primaryDark"
        >Définir comme « Intervenant »
    </Button>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Button } from "@resorptionbidonvilles/ui";
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
