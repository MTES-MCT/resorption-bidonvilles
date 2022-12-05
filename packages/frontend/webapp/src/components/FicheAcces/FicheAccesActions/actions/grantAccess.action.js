import { sendActivationLink } from "@/api/users.api";
import { useAccesStore } from "@/stores/acces.store";
import { useNotificationStore } from "@/stores/notification.store";
import { trackEvent } from "@/helpers/matomo";

export default async function (user, options) {
    const accesStore = useAccesStore();
    const notificationStore = useNotificationStore();
    const updatedUser = await sendActivationLink(user.id, { options });
    accesStore.updateUser(user.id, updatedUser);
    notificationStore.success(
        "Accès accordé",
        "Un accès à la plateforme vient d'être envoyé par mail à l'utilisateur"
    );
    trackEvent("Demande d'accès", "Approuver accès");
}
