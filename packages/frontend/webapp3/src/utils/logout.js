import { trackLogout } from "@/helpers/matomo.js";
import { useUserStore } from "@/stores/user.store";
import router from "@/helpers/router";

export default function (redirectTo = "/connexion") {
    const userStore = useUserStore();
    userStore.signout();
    trackLogout();
    router.push(redirectTo);
}
