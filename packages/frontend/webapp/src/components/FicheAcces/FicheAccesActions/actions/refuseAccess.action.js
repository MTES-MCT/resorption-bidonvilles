import { refuseAccess } from "@/api/users.api";
import { useAccesStore } from "@/stores/acces.store";
import { useNotificationStore } from "@/stores/notification.store";
import { trackEvent } from "@/helpers/matomo";
import backOrReplace from "@/utils/backOrReplace";

export default async function (user) {
    const accesStore = useAccesStore();
    const notificationStore = useNotificationStore();
    const updatedUser = await refuseAccess(user.id);

    accesStore.updateUser(user.id, updatedUser);
    notificationStore.success(
        "Demande d'accès classée sans suite",
        "La demande d'accès à été classée sans suite et le compte supprimé sans que l'utilisateur n'en soit notifié par mail."
    );
    trackEvent(
        "Demande d'accès",
        "Demande classée sans suite par un administrateur"
    );
    backOrReplace("/acces");
}
