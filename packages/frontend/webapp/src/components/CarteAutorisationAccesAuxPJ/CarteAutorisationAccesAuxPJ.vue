<template>
    <div @mouseenter="isHover = true" @mouseleave="isHover = false">
        <div v-if="organizationsWithUsersHavingJusticePermissions.length > 0">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CarteStructure
                    v-for="organization in organizationsWithUsersHavingJusticePermissions"
                    :key="organization.organization_id"
                    :organization="organization"
                    :wording="wording"
                />
            </div>
        </div>
        <div v-else>
            <Icon icon="lock" class="text-red" />
            <span class="pl-1 font-bold">
                Seuls les utilisateurs en préfecture et DEETS / DREETS ont accès
                aux données judiciaires de ce site.</span
            >
        </div>
    </div>
</template>
<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import CarteStructure from "@/components/CarteStructure/CarteStructure.vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    usersWithPermissionOnJustice: Object,
});

const isHover = ref(false);
const { usersWithPermissionOnJustice } = toRefs(props);

const wording = ref({
    first: "autorisé",
    second: "à accéder aux procédures judiciaires",
});

const organizationsWithUsersHavingJusticePermissions = computed(() => {
    console.log(
        `usersWithPermissionOnJustice: ${JSON.stringify(
            Object.values(usersWithPermissionOnJustice.value)
        )}`
    );
    return Object.values(usersWithPermissionOnJustice.value);
});
</script>
