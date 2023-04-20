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
            ></FicheAccesBodyPermissionDetails>

            <FicheAccesBodyPermissionDetails
                v-if="accessPermission.local_permissions?.length > 0"
                title="À l'échelle de son territoire"
                :items="accessPermission.local_permissions"
            ></FicheAccesBodyPermissionDetails>
        </template>
    </FicheAccesBodySection>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import FicheAccesBodySection from "./FicheAccesBodySection.vue";
import FicheAccesBodyPermissionDetails from "./FicheAccesBodyPermissionDetails.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);

const accessPermission = computed(() => {
    const configStore = useConfigStore();
    return configStore.config.permissions_description[user.value.role_id];
});
</script>
