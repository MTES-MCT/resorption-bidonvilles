import { useActionsStore } from "@/stores/actions.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";
import { defineStore } from "pinia";

export const useAttachmentsStore = defineStore("attachments", () => {
    const townsStore = useTownsStore();
    const actionsStore = useActionsStore();
    const deleteFns = {
        shantytownComment: townsStore.deleteCommentAttachment,
        actionComment: actionsStore.deleteCommentAttachment,
        question: () => {},
        answer: () => {},
    };

    async function deleteAttachment(type, file, data) {
        if (deleteFns[type] === undefined) {
            throw new Error("Impossible de supprimer ce type de pièce jointe");
        }

        if (file.loading === true) {
            return;
        }

        const notificationStore = useNotificationStore();
        file.loading = true;

        try {
            const response = await deleteFns[type](file, data);
            notificationStore.success(
                "Suppression réussie",
                "Le fichier a bien été supprimé"
            );
            file.loading = false;
            return response;
        } catch (error) {
            file.loading = false;
            notificationStore.error(
                "Suppression échouée",
                error?.user_message ||
                    "Une erreur inconnue est survenue lors de la suppression"
            );
        }
    }

    return {
        deleteShantytownCommentAttachment(file, data) {
            return deleteAttachment("shantytownComment", file, data);
        },
        deleteActionCommentAttachment(file, data) {
            return deleteAttachment("actionComment", file, data);
        },
    };
});
