import { modifyOptions } from "@/api/users.api";
import { useNotificationStore } from "@/stores/notification.store";
import { useInputsStore } from "@/stores/inputs.store";

export default async function (user, options) {
    const notificationStore = useNotificationStore();
    const inputStore = useInputsStore();
    if (options === undefined) {
        options = inputStore.options;
    }
    try {
        await modifyOptions(user.id, inputStore.options);
        notificationStore.success(
            "Succès",
            "Les options de l'utilisateur ont bien été modifiées"
        );
        return true;
    } catch (error) {
        notificationStore.error(
            "Erreur",
            "Une erreur est survenue lors de la modification des options de l'utilisateur"
        );
        return false;
    }
}
