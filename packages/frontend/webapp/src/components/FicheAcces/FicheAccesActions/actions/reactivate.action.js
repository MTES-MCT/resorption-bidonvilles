import { reactivateUser } from "@/api/users.api";
import { useAccesStore } from "@/stores/acces.store";
import { useNotificationStore } from "@/stores/notification.store";

export default async function (user) {
    const notificationStore = useNotificationStore();
    const accesStore = useAccesStore();
    const updatedUser = await reactivateUser(user.id);
    accesStore.updateUser(user.id, updatedUser);
    notificationStore.success(
        "Réactivation de l'accès",
        "L'accès de cet utilisateur a bien été rétabli."
    );
}
