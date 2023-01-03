import { trackLogout } from "@/helpers/matomo.js";
import { useUserStore } from "@/stores/user.store";
import router from "@/helpers/router";
import ENV from "@/helpers/env";

export default function (redirectTo = null) {
    const userStore = useUserStore();
    userStore.signout();
    trackLogout();

    if (redirectTo !== null) {
        router.push(redirectTo);
    } else {
        location.replace(ENV.WWW_URL);
    }
}
