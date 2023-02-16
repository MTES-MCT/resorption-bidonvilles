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
                >Journal de l'action</Button
            >
        </RouterLink>
        <Button
            v-if="
                !isClosed &&
                userStore.hasActionPermission('action.update', action)
            "
            size="sm"
            variant="primary"
            icon="pencil"
            iconPosition="left"
            :href="`/action/${action.id}/mise-a-jour`"
            >Mettre à jour</Button
        >
    </p>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const userStore = useUserStore();

const isClosed = computed(() => {
    return action.value.ended_at && action.value.ended_at < Date.now();
});
</script>
