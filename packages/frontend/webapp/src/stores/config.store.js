import { defineStore } from "pinia";
import { get } from "@/api/config.api";
import { useUserStore } from "@/stores/user.store.js";

export const useConfigStore = defineStore("config", {
    state: () => ({
        config: null,
    }),
    getters: {
        isLoaded() {
            return this.config !== null;
        },
    },
    actions: {
        async load() {
            const userStore = useUserStore();
            this.config = await get();

            // si l'access token a plus de 24h d'existence, on le renouvelle
            if (
                Date.now() - userStore.accessTokenCreatedAt >
                24 * 60 * 60 * 1000
            ) {
                userStore.refreshToken();
            }
        },
        unload() {
            this.config = null;
        },
        setPermissions(permissions) {
            if (!this.config?.user) {
                return;
            }

            this.config.user.permissions = permissions;
        },
    },
});
