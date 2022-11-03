import { trackLogout } from "@/helpers/matomo.js";
import { useUserStore } from "@/stores/user.store";
import router from "@/helpers/router";

export default function (redirectTo = null) {
    const userStore = useUserStore();
    userStore.signout();
    trackLogout();

    if (redirectTo !== null) {
        router.push(redirectTo);
    }
}
