<template>
    <p class="flex space-x-2">
        <RouterLink
            to="#journal_de_l_action"
            v-if="userStore.hasActionPermission('action_comment.read', action)"
        >
            <DsfrButton size="sm" secondary icon="fr-icon-chat-3-fill"
                >Journal de l'action</DsfrButton
            >
        </RouterLink>
        <DsfrButton
            v-if="userStore.hasActionPermission('action.update', action)"
            size="sm"
            icon="fr-icon-pencil-line"
            @click.prevent.stop="navigateTo('mise-a-jour')"
            >Mettre à jour</DsfrButton
        >
    </p>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { useRouter } from "vue-router";

const props = defineProps({
    action: Object,
});

const router = useRouter();
const { action } = toRefs(props);
const userStore = useUserStore();

const navigateTo = (target) => {
    if (action.value && action.value.id) {
        let path = `/action/${action.value.id}`;
        if (target) {
            path += `/${target}`;
        }
        router.push(path);
    }
};
</script>

<style scoped>
button {
    border: inherit;
}
</style>
