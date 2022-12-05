<template>
    <div class="flex justify-end h-14 items-center mr-4 space-x-4 print:hidden">
        <Button
            v-if="isHover && isOpen && hasUpdateShantytownPermission"
            variant="primaryOutline"
            size="sm"
            icon="pencil-alt"
            iconPosition="left"
            :href="`/site/${shantytown.id}/mise-a-jour`"
            >Mettre à jour</Button
        >
        <Link :to="`/site/${shantytown.id}`">
            <Icon icon="arrow-right" /> Voir la fiche du site</Link
        >
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";

import { Icon, Button, Link } from "@resorptionbidonvilles/ui";

const props = defineProps({
    shantytown: Object,
    isHover: {
        type: Boolean,
        default: false,
    },
});
const userStore = useUserStore();
const { shantytown, isHover } = toRefs(props);

const hasUpdateShantytownPermission = computed(() => {
    return userStore.hasUpdateShantytownPermission(shantytown.value);
});
const isOpen = computed(() => {
    return shantytown.value.status === "open";
});
</script>
