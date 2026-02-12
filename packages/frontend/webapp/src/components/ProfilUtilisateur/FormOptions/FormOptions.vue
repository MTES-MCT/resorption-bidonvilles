<template>
    <div>
        <p class="font-bold mb-4">Options du compte</p>

        <div v-if="optionList.length === 0">
            <p class="italic">
                Aucune option disponible pour ce type de compte.
            </p>
        </div>

        <div v-else>
            <p class="mb-4">
                Cochez ou décochez les options que vous souhaitez activer ou
                désactiver pour cet utilisateur.
            </p>

            <div class="max-w-lg">
                <DsfrCheckboxSet
                    v-model="selectedOptions"
                    :options="checkboxOptions"
                    name="options"
                />
            </div>

            <ErrorSummary v-if="error" :message="error" />

            <DsfrButton
                class="mt-4"
                :disabled="!hasChanges && !isLoading"
                :icon="buttonIcon"
                @click="onSubmit"
                >Sauvegarder</DsfrButton
            >
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, toRefs, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { useNotificationStore } from "@/stores/notification.store";
import { modifyOptions } from "@/api/users.api";
import { ErrorSummary } from "@resorptionbidonvilles/ui";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);

const error = ref(null);
const isLoading = ref(false);

const selectedOptions = ref([...(user.value.permission_options || [])]);

const optionList = computed(() => {
    const configStore = useConfigStore();
    const roleDescription =
        configStore.config.permissions_description[user.value.role_id];
    return roleDescription?.options || [];
});

const checkboxOptions = computed(() =>
    optionList.value.map((option) => ({
        label: option.label,
        value: option.id,
        id: `option-${option.id}`,
        name: "options",
    }))
);

const buttonIcon = computed(() => {
    if (!isLoading.value) {
        return undefined;
    }
    return { name: "ri:loader-4-line", animation: "spin" };
});

const hasChanges = computed(() => {
    const current = [...selectedOptions.value].sort();
    const original = [...(user.value.permission_options || [])].sort();
    if (current.length !== original.length) {
        return true;
    }
    return current.some((v, i) => v !== original[i]);
});

async function onSubmit() {
    if (isLoading.value) {
        return;
    }

    isLoading.value = true;
    error.value = null;

    try {
        // TODO: au relecteur - supprimer ce délai artificiel qui permet de vérifier l'affichage du spinner après le clic sur le bouton
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await modifyOptions(user.value.id, selectedOptions.value);
        user.value.permission_options = [...selectedOptions.value];

        const notificationStore = useNotificationStore();
        notificationStore.success(
            "Options du compte",
            "Les options ont bien été mises à jour"
        );
    } catch (e) {
        error.value =
            e?.user_message || "Une erreur est survenue lors de la sauvegarde";
    }

    isLoading.value = false;
}
</script>
