import { denyAccess } from "@/api/users.api";
import { useAccesStore } from "@/stores/acces.store";
import { useNotificationStore } from "@/stores/notification.store";
import { trackEvent } from "@/helpers/matomo";
import backOrReplace from "@/utils/backOrReplace";

export default async function (user) {
    const accesStore = useAccesStore();
    const notificationStore = useNotificationStore();
    await denyAccess(user.id);
    accesStore.deleteUser(user.id);
    notificationStore.success(
        "Accès refusé",
        "L'utilisateur vient d'être notifié par mail et son compte supprimé"
    );
    trackEvent("Demande d'accès", "Refuser accès");
    backOrReplace("/acces");
}
