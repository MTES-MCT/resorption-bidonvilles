import { deactivateUser } from "@/api/users.api";
import { useAccesStore } from "@/stores/acces.store";
import { useNotificationStore } from "@/stores/notification.store";

export default async function (user) {
    const accesStore = useAccesStore();
    const notificationStore = useNotificationStore();
    const updatedUser = await deactivateUser(user.id);
    accesStore.updateUser(user.id, updatedUser);
    notificationStore.success(
        "Changement utilisateur",
        "L'accès de cet utilisateur a bien été supprimé"
    );
}
