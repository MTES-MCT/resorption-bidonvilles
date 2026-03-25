<template>
    <DsfrButton
        v-if="
            !user.is_admin &&
            user.role_id !== 'intervener' &&
            user.status !== 'inactive' &&
            user.status !== 'refused' &&
            user.status !== 'new' &&
            hasAvailableOptions
        "
        :loading="isLoading"
        :disabled="disabled"
        :secondary="!accesStore.activatedOptions"
        :primary="accesStore.activatedOptions"
        >Modifier les options
    </DsfrButton>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { useAccesStore } from "@/stores/acces.store";
import { useConfigStore } from "@/stores/config.store";

const props = defineProps({
    user: Object,
    isLoading: Boolean,
    disabled: Boolean,
});
const { user, isLoading, disabled } = toRefs(props);
const accesStore = useAccesStore();
const configStore = useConfigStore();

const hasAvailableOptions = computed(() => {
    const rolePermissions =
        configStore.config.permissions_description?.[user.value?.role_id];
    return rolePermissions?.options?.length > 0;
});
</script>
