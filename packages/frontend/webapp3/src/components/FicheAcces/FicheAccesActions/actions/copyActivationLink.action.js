import { getLatestActivationLink } from "@/api/users.api";
import { useNotificationStore } from "@/stores/notification.store";
import copyToClipboard from "@/utils/copyToClipboard";

export default async function (user) {
    const notificationStore = useNotificationStore();
    const { link } = await getLatestActivationLink(user.id);
    copyToClipboard(link);
    notificationStore.success(
        "Lien d'activation",
        "Le lien d'activation a été copié dans votre presse-papier"
    );
}
