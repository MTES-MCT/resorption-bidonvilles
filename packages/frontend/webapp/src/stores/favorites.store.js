import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
    addFavorite,
    removeFavorite,
    fetchFavorites,
} from "@/api/favorites.api";
import { useTownsStore } from "@/stores/towns.store";

export const useFavoritesStore = defineStore("favorites", () => {
    const favoriteIds = ref({});
    const isLoading = ref(false);
    const error = ref(null);

    const favoriteTowns = computed(() => {
        const townsStore = useTownsStore();
        return Object.keys(favoriteIds.value)
            .map((id) => townsStore.hash[Number(id)])
            .filter(Boolean);
    });

    async function fetch() {
        isLoading.value = true;
        error.value = null;
        try {
            const ids = await fetchFavorites();
            favoriteIds.value = Object.fromEntries(ids.map((id) => [id, true]));
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function add(townId) {
        error.value = null;
        try {
            await addFavorite(townId);
            favoriteIds.value = { ...favoriteIds.value, [townId]: true };
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            throw e;
        }
    }

    async function remove(townId) {
        error.value = null;
        try {
            await removeFavorite(townId);
            const updated = { ...favoriteIds.value };
            delete updated[townId];
            favoriteIds.value = updated;
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            throw e;
        }
    }

    function isFavorite(townId) {
        return !!favoriteIds.value[townId];
    }

    return {
        favoriteTowns,
        favoriteIds,
        isLoading,
        error,
        fetch,
        add,
        remove,
        isFavorite,
    };
});
