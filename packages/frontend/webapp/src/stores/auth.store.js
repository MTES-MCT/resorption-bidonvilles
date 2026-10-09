import { defineStore } from "pinia";
import keycloak from "@/helpers/keycloak";

let initPromise = null;

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isReady: false,
        isAuthenticated: false,
        initError: null,
        keycloakId: null,
    }),
    actions: {
        initKeycloak() {
            if (initPromise) {
                return initPromise;
            }

            initPromise = keycloak
                .init({
                    onLoad: "check-sso",
                    checkLoginIframe: false,
                    pkceMethod: "S256",
                    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
                })
                .then((authenticated) => {
                    this.isAuthenticated = authenticated;
                    this.isReady = true;
                    this.keycloakId = keycloak.subject;
                    return authenticated;
                })
                .catch((err) => {
                    if (err?.error === "login_required") {
                        // Comportement normal en mode check-sso : aucune session active
                        this.isAuthenticated = false;
                        this.isReady = true;
                        return false;
                    }
                    this.initError = err;
                    this.isReady = true;
                    throw err;
                });

            return initPromise;
        },

        async login(initOptions = null) {
            keycloak.login(initOptions);
        },
        async ensureReady() {
            if (!initPromise) {
                this.initKeycloak();
            }
            try {
                return await initPromise;
            } catch {
                // L'erreur est déjà stockée dans state.initError
                return false;
            }
        },
    },
});
