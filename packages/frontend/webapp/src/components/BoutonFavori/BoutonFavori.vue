<template>
    <DsfrButton
        v-if="canUseFavorites"
        size="sm"
        :icon="isFavorite ? 'ri:star-fill' : 'ri:star-line'"
        secondary
        :label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
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

const EXCLUDED_ROLES = new Set(["intervener", "external_observator"]);

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

onMounted(() => {
    if (
        canUseFavorites.value &&
        Object.keys(favoritesStore.favoriteIds).length === 0 &&
        !favoritesStore.isLoading
    ) {
        favoritesStore.fetch();
    }
});

async function handleClick() {
    try {
        if (isFavorite.value) {
            await favoritesStore.remove(props.townId);
            trackEvent(
                "Favoris",
                "bookmarked_sites_remove",
                `S${props.townId}`
            );
            notificationStore.success(
                "Favoris",
                "Le site a été retiré de vos favoris."
            );
        } else {
            await favoritesStore.add(props.townId);
            trackEvent("Favoris", "bookmarked_sites_add", `S${props.townId}`);
            notificationStore.success(
                "Favoris",
                "Le site a été ajouté à vos favoris."
            );
        }
    } catch {
        notificationStore.error(
            "Favoris",
            "Une erreur est survenue. Veuillez réessayer."
        );
    }
}
</script>
