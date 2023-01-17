import { modifyOptions } from "@/api/users.api";
import { useNotificationStore } from "@/stores/notification.store";

export default async function (user, options) {
    const notificationStore = useNotificationStore();
    const updatedUser = await modifyOptions(user.id, options);
    notificationStore.success(
        "Succès",
        "Les options de l'utilisateur ont bien été modifiées"
    );
    return updatedUser;
}
