import { ref } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { useNotificationStore } from "@/stores/notification.store";

export function useResorptionTarget(townId) {
    const townsStore = useTownsStore();
    const notificationStore = useNotificationStore();
    const resorptionTargetIsLoading = ref(false);

    async function markAsResorptionTarget() {
        if (resorptionTargetIsLoading.value === true) {
            return;
        }

        const currentYear = new Date().getFullYear();
        if (
            !confirm(
                `Êtes-vous sûr(e) de vouloir marquer ce site comme "Objectif résorption ${currentYear}" ?`
            )
        ) {
            return;
        }

        resorptionTargetIsLoading.value = true;

        try {
            await townsStore.setResorptionTarget(townId.value);
            notificationStore.success(
                "Objectif résorption",
                `Le site a été marqué "Objectif résorption ${currentYear}"`
            );
        } catch (e) {
            notificationStore.error(
                "Objectif résorption",
                e?.user_message || "Une erreur inconnue est survenue"
            );
        }

        resorptionTargetIsLoading.value = false;
    }

    return {
        resorptionTargetIsLoading,
        markAsResorptionTarget,
    };
}
