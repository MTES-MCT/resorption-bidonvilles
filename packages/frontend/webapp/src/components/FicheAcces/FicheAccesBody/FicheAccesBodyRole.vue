<template>
    <FicheAccesBodySection class="mt-6">
        <template v-slot:title>Accès « {{ user.role }} »</template>
        <template v-if="accessPermission.description">
            <p class="mb-2">{{ accessPermission.description }}</p>
            <p class="mb-4">
                Cet accès accorde les droits suivants à l'utilisateur :
            </p>

            <FicheAccesBodyPermissionDetails
                class="mb-4"
                v-if="accessPermission.national_permissions?.length > 0"
                title="À l’échelle nationale"
                :items="accessPermission.national_permissions"
                :options="options"
            ></FicheAccesBodyPermissionDetails>

            <FicheAccesBodyPermissionDetails
                v-if="accessPermission.local_permissions?.length > 0"
                title="À l'échelle de son territoire"
                :items="accessPermission.local_permissions"
                :user="user"
                :options="options"
            ></FicheAccesBodyPermissionDetails>
        </template>
        <div class="flex items-center justify-end">
            <Button
                variant="tertiaryA11Yalt"
                @click="updateOptions"
                :disabled="!pendingOptionsChanges"
                :loading="isLoading"
                >Sauvegarder les options</Button
            >
        </div>
    </FicheAccesBodySection>
</template>

<script setup>
import { defineProps, toRefs, computed, ref, watchEffect, toRaw } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { useInputsStore } from "@/stores/inputs.store";
import { Button } from "@resorptionbidonvilles/ui";
import { isDeepEqual } from "@common/utils/isDeepEqual";
import modifyOptions from "../FicheAccesActions/actions/modifyOptions.action";
import FicheAccesBodySection from "./FicheAccesBodySection.vue";
import FicheAccesBodyPermissionDetails from "./FicheAccesBodyPermissionDetails.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
});
const { user, options } = toRefs(props);
const isLoading = ref(false);
const pendingOptionsChanges = ref(false);
const inputsStore = useInputsStore();

const accessPermission = computed(() => {
    const configStore = useConfigStore();
    return configStore.config.permissions_description[user.value.role_id];
});

const updateOptions = async () => {
    isLoading.value = true;
    const changingUserOptions = await modifyOptions(user.value, options.value);
    isLoading.value = false;
    if (changingUserOptions) {
        user.value.permission_options = inputsStore.options;
    }
};

watchEffect(() => {
    const rawOptionsArray = toRaw(inputsStore.options);
    const userOptionsArray = user.value.permission_options || [];

    pendingOptionsChanges.value = !isDeepEqual(
        rawOptionsArray,
        toRaw(userOptionsArray)
    );
});
</script>
