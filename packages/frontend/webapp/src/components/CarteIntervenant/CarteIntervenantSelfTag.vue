<template>
    <Tag variant="selfTheme" class="py-2">
        <p class="flex items-center">
            {{ theme.value || themes[theme.id] }}
            <span
                @mouseenter="hovered = true"
                @mouseleave="hovered = false"
                class="ml-2"
                :class="!isLoading ? 'cursor-pointer' : ''"
                @click="remove"
            >
                <Spinner v-if="isLoading" />
                <Icon
                    v-else
                    :icon="hovered ? 'trash-alt' : 'fa-regular fa-trash-alt'"
                />
            </span>
        </p>
    </Tag>
</template>

<script setup>
import { computed, defineProps, ref, toRefs } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";

import { Icon, Spinner, Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    townId: Number,
    theme: Object,
});
const { townId, theme } = toRefs(props);
const hovered = ref(false);
const isLoading = ref(false);

const configStore = useConfigStore();

const themes = computed(() => {
    return configStore.config.actor_themes;
});

async function remove() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    const notificationStore = useNotificationStore();

    try {
        const townsStore = useTownsStore();
        const userStore = useUserStore();
        await townsStore.removeActorTheme(
            townId.value,
            userStore.id,
            theme.value.id
        );
        notificationStore.success(
            "Champs d'intervention",
            "Le champ d'intervention a bien été retiré"
        );
    } catch (e) {
        notificationStore.error(
            "Champs d'intervention",
            e?.user_message || "Une erreur inconnue est survenue"
        );
    }

    isLoading.value = false;
}
</script>
