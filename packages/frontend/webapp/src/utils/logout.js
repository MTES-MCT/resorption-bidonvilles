import { trackLogout } from "@/helpers/matomo.js";
import { useUserStore } from "@/stores/user.store";
import { useAuthStore } from "@/stores/auth.store";
import keycloak from "@/helpers/keycloak";
import ENV from "@/helpers/env";

async function logout() {
    const authStore = useAuthStore();
    const userStore = useUserStore();
    trackLogout();
    // 1. Vide les stores locaux
    authStore.$reset();
    userStore.signout();

    // 2. Déclenche le logout Keycloak
    await keycloak.logout({
        redirectUri: ENV.WWW_URL,
    });
}
export default logout;
