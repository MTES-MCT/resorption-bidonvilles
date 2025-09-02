<template>
    <Button
        v-if="
            userStore.user?.is_superuser &&
            !user.is_admin &&
            user.status !== 'inactive' &&
            user.status !== 'refused'
        "
        type="button"
        variant="primaryOutline"
        :loading="isLoading"
        :disabled="disabled"
        @click="openChangeRoleModale"
        class="!border !border-primary hover:!bg-primaryDark"
        >Changer le rôle</Button
    >
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { Button } from "@resorptionbidonvilles/ui";
import { useModaleStore } from "@/stores/modale.store";
import { useUserStore } from "@/stores/user.store";
import ModaleChangerRoleUser from "@/components/ModaleChangerRoleUser/ModaleChangerRoleUser.vue";

const props = defineProps({
    user: Object,
    isLoading: Boolean,
    disabled: Boolean,
});
const { user, isLoading, disabled } = toRefs(props);

const userStore = useUserStore();

const simplifiedUser = computed(() => {
    return {
        id: user.value.id,
        firstName: user.value.first_name,
        lastName: user.value.last_name,
        roleId: user.value.role_id,
        roleName: user.value.role,
    };
});

function openChangeRoleModale() {
    const modaleStore = useModaleStore();
    modaleStore.open(ModaleChangerRoleUser, {
        user: simplifiedUser.value,
    });
}
</script>

<style scoped>
button {
    border: inherit;
}
</style>
