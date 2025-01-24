<template>
    <p class="flex space-x-2">
        <RouterLink
            to="#journal_de_l_action"
            v-if="userStore.hasActionPermission('action_comment.read', action)"
        >
            <Button
                size="sm"
                variant="primaryOutline"
                icon="comment"
                iconPosition="left"
                class="!border-2 !border-primary hover:!bg-primary"
                >Journal de l'action</Button
            >
        </RouterLink>
        <Button
            v-if="userStore.hasActionPermission('action.update', action)"
            size="sm"
            variant="primary"
            icon="pencil"
            iconPosition="left"
            :href="`/action/${action.id}/mise-a-jour`"
            class="hover:!bg-primaryDark"
            >Mettre à jour</Button
        >
    </p>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const userStore = useUserStore();
</script>

<style scoped>
button {
    border: inherit;
}
</style>
