<template>
    <Modal closeWhenClickOutside @close="onClose" ref="modale">
        <template v-slot:title> Changer le rôle d'un utilisateur </template>

        <template v-slot:body>
            <ModaleChangerRoleUserIdentiteEtRole
                class="border-b p-6 mb-8"
                :user="user"
            />
            <ModaleChangerRoleUserListeRole
                :options="filteredRoles"
                @update-role="setNewRole"
            />

            <ErrorSummary v-if="error" :message="error" class="mb-0 mt-6" />
        </template>

        <template v-slot:footer>
            <Button
                variant="primaryText"
                :loading="loading"
                @click="() => modale.close()"
                class="!border-2 !border-primary hover:!bg-primaryDark hover:!text-white"
                >Annuler</Button
            >
            <Button
                class="ml-5"
                :loading="loading"
                @click.prevent="updateUserRole"
                >Valider</Button
            >
        </template>
    </Modal>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import { Button, ErrorSummary, Modal } from "@resorptionbidonvilles/ui";
import { useNotificationStore } from "@/stores/notification.store";
import { useModaleStore } from "@/stores/modale.store";
import ModaleChangerRoleUserIdentiteEtRole from "./ModaleChangerRoleUserIdentiteEtRole.vue";
import ModaleChangerRoleUserListeRole from "./ModaleChangerRoleUserListeRole.vue";
import { useConfigStore } from "@/stores/config.store";
import { useAccesStore } from "@/stores/acces.store";

const configStore = useConfigStore();
const { roles } = configStore.config;

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});

const { user } = toRefs(props);

const modale = ref(null);

const loading = ref(false);
const error = ref(null);
const errorSummary = ref({});
const role = ref(null);

const notificationStore = useNotificationStore();

function reset() {
    loading.value = false;
    error.value = null;
}

function onClose() {
    reset();
}

const filteredRoles = computed(() => {
    return roles.filter(
        (role) =>
            role.id !== user.value.roleId && role.id !== "national_establisment"
    );
});

function setNewRole(e) {
    role.value = e;
}

async function updateUserRole() {
    if (loading.value === true) {
        return;
    }

    loading.value = true;
    error.value = null;
    errorSummary.value = {};

    try {
        const modaleStore = useModaleStore();
        const accesStore = useAccesStore();
        await accesStore.updateUserRole(user.value.id, role.value);

        notificationStore.success(
            "Rôle mis à jour",
            "Le rôle de l'utilisateur a bien été modifié"
        );
        modaleStore.close();
    } catch (e) {
        notificationStore.error(
            "Le changement de rôle a échoué",
            error.value?.user_message || "Une erreur inconnue est survenue"
        );
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }
    loading.value = false;

    return true;
}
</script>
<style scoped>
button {
    border: inherit;
}
</style>
