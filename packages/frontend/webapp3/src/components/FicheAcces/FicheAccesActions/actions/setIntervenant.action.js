import { setRoleRegular } from "@/api/users.api";
import { useAccesStore } from "@/stores/acces.store";
import { useNotificationStore } from "@/stores/notification.store";

export default async function (user) {
    const accesStore = useAccesStore();
    const notificationStore = useNotificationStore();
    const updatedUser = await setRoleRegular(user.id, "intervener");
    accesStore.updateUser(user.id, updatedUser);
    notificationStore.success(
        "Changement utilisateur",
        "L'utilisateur a bien été passé intervenant"
    );
}
