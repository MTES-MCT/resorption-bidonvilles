import { setLocalAdmin } from "@/api/users.api";
import { useAccesStore } from "@/stores/acces.store";
import { useNotificationStore } from "@/stores/notification.store";

export default async function (user, isAdmin) {
    const accesStore = useAccesStore();
    const notificationStore = useNotificationStore();
    const updatedUser = await setLocalAdmin(user.id, isAdmin);
    accesStore.updateUser(user.id, updatedUser);
    notificationStore.success(
        "Changement utilisateur",
        isAdmin
            ? "L'utilisateur a bien été passé administrateur local"
            : "L'utilisateur ne dispose plus des droits d'administration"
    );
}
