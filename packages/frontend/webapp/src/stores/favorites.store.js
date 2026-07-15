import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
    addFavorite,
    removeFavorite,
    fetchFavorites,
} from "@/api/favorites.api";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import filterShantytowns from "@/utils/filterShantytowns";

export const useFavoritesStore = defineStore("favorites", () => {
    const favoriteIds = ref({});
    const isLoading = ref(false);
    const loadingIds = ref(new Set());
    const error = ref(null);

    // Filtre de l'onglet « Mes sites », piloté par le composant Filter
    // (multi-sélection). Valeurs possibles : "intervention", "favorites".
    // Tableau vide = aucune case cochée = union des deux (comportement par défaut).
    const myTownsFilter = ref([]);

    const favoriteTowns = computed(() => {
        const townsStore = useTownsStore();
        return Object.keys(favoriteIds.value)
            .map((id) => townsStore.hash[Number(id)])
            .filter(Boolean);
    });

    // Sites sur lesquels l'utilisateur s'est déclaré intervenant, c.-à-d. présent
    // dans town.actors[] (table shantytown_actors). Indépendant du role_id :
    // serializeActor expose le user id sous la clé `id` (cf. FicheSiteIntervenants).
    const interventionTowns = computed(() => {
        const townsStore = useTownsStore();
        const userStore = useUserStore();
        const userId = userStore.id;
        if (!userId) {
            return [];
        }
        return townsStore.towns.filter((town) =>
            (town.actors || []).some((actor) => actor.id === userId)
        );
    });

    // Périmètre de base de l'onglet « Mes sites » selon le filtre « Mes sites »
    // (cases intervention / favoris). Aucune case (ou les deux) = union
    // dédoublonnée par id (un site à la fois favori et d'intervention n'apparaît
    // qu'une seule fois).
    const myTownsBase = computed(() => {
        const filter = myTownsFilter.value;
        const nothingChecked = filter.length < 1;
        const wantsFavorites = nothingChecked || filter.includes("favorites");
        const wantsIntervention =
            nothingChecked || filter.includes("intervention");

        const hash = {};
        if (wantsIntervention) {
            interventionTowns.value.forEach((town) => {
                hash[town.id] = town;
            });
        }
        if (wantsFavorites) {
            favoriteTowns.value.forEach((town) => {
                hash[town.id] = town;
            });
        }
        return Object.values(hash);
    });

    // Liste finale affichée : le périmètre « Mes sites » affiné par les autres
    // filtres (population, origines, etc.) via le même moteur que les onglets
    // classiques. Le status "favorites" active les filtres utiles à une liste
    // au statut mixte (cf. filterShantytowns).
    const myTowns = computed(() => {
        const townsStore = useTownsStore();
        return filterShantytowns(myTownsBase.value, {
            status: "favorites",
            search: townsStore.filters.search,
            location: townsStore.filters.location,
            ...townsStore.filters.properties,
        });
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
        loadingIds.value.add(townId);
        try {
            await addFavorite(townId);
            favoriteIds.value[townId] = true;
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            throw e;
        } finally {
            loadingIds.value.delete(townId);
        }
    }

    async function remove(townId) {
        error.value = null;
        loadingIds.value.add(townId);
        try {
            await removeFavorite(townId);
            delete favoriteIds.value[townId];
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            throw e;
        } finally {
            loadingIds.value.delete(townId);
        }
    }

    function isFavorite(townId) {
        return !!favoriteIds.value[townId];
    }

    function isLoadingId(townId) {
        return loadingIds.value.has(townId);
    }

    return {
        favoriteTowns,
        favoriteIds,
        interventionTowns,
        myTowns,
        myTownsFilter,
        isLoading,
        error,
        fetch,
        add,
        remove,
        isFavorite,
        isLoadingId,
    };
});
