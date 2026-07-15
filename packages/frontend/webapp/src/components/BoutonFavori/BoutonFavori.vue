<template>
    <DsfrButton
        v-if="canUseFavorites"
        size="sm"
        :icon="
            isLoadingTown
                ? 'ri:loader-4-line'
                : isFavorite
                ? 'ri:pushpin-fill'
                : 'ri:pushpin-line'
        "
        secondary
        :disabled="isLoadingTown"
        :label="isFavorite ? 'Retirer des sites épinglés' : 'Épingler ce site'"
        :aria-label="
            isFavorite ? 'Retirer des sites épinglés' : 'Épingler ce site'
        "
        :aria-pressed="isFavorite"
        @click.stop="handleClick"
    />
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useFavoritesStore } from "@/stores/favorites.store";
import { useNotificationStore } from "@/stores/notification.store";
import { trackEvent } from "@/helpers/matomo";
import { EXCLUDED_ROLES } from "@/utils/excluded_roles.js";

const props = defineProps({
    townId: {
        type: Number,
        required: true,
    },
});

const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const notificationStore = useNotificationStore();

const canUseFavorites = computed(
    () => !EXCLUDED_ROLES.has(userStore.user?.role_id)
);

const isFavorite = computed(() => favoritesStore.isFavorite(props.townId));
const isLoadingTown = computed(() => favoritesStore.isLoadingId(props.townId));

onMounted(() => {
    if (
        canUseFavorites.value &&
        favoritesStore.favoriteIds.size === 0 &&
        !favoritesStore.isLoading
    ) {
        favoritesStore.fetch();
    }
});

async function handleClick() {
    if (isLoadingTown.value) {
        return;
    }
    try {
        if (isFavorite.value) {
            await favoritesStore.remove(props.townId);
            trackEvent(
                "Sites épinglés",
                "bookmarked_sites_remove",
                `S${props.townId}`
            );
            notificationStore.success(
                "Sites épinglés",
                "Le site a été retiré des sites épinglés."
            );
        } else {
            await favoritesStore.add(props.townId);
            trackEvent(
                "Sites épinglés",
                "bookmarked_sites_add",
                `S${props.townId}`
            );
            notificationStore.success(
                "Sites épinglés",
                "Le site a été ajouté aux sites épinglés."
            );
        }
    } catch {
        notificationStore.error(
            "Sites épinglés",
            "Une erreur est survenue. Veuillez réessayer."
        );
    }
}
</script>
