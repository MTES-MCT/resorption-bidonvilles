import { anonymizeUser } from "@/api/users.api";
import { useAccesStore } from "@/stores/acces.store";
import { useNotificationStore } from "@/stores/notification.store";

export default async function (user) {
    const notificationStore = useNotificationStore();
    const accesStore = useAccesStore();
    const updatedUser = await anonymizeUser(user.id);

    accesStore.updateUser(user.id, updatedUser);
    notificationStore.success(
        updatedUser.anonymization_requested
            ? "Demande d'anonymisation prise en compte"
            : "Annulation de l'anonymisation",
        updatedUser.anonymization_requested
            ? "L'utilisateur sera anonymisé dans la nuit."
            : "La demande d'anonymisation a bien été annulée."
    );
}
