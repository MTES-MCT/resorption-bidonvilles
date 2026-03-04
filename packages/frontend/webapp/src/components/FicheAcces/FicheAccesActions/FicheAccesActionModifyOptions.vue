<template>
    <DsfrButton
        v-if="
            (userStore.user?.is_admin || userStore.user?.is_superuser) &&
            !user.is_admin &&
            user.role_id !== 'intervener' &&
            user.status !== 'inactive' &&
            user.status !== 'refused' &&
            user.status !== 'new'
        "
        :loading="isLoading"
        :disabled="disabled"
        :secondary="!accesStore.activatedOptions"
        :primary="accesStore.activatedOptions"
        >Modifier les options
    </DsfrButton>
</template>

<script setup>
import { toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useAccesStore } from "@/stores/acces.store";

const props = defineProps({
    user: Object,
    isLoading: Boolean,
    disabled: Boolean,
});
const { user, isLoading, disabled } = toRefs(props);
const userStore = useUserStore();
const accesStore = useAccesStore();
</script>
