<template>
    <ViewHeader icon="handshake-angle">
        <template v-slot:title>Liste des actions</template>
        <template v-slot:description
            >Consultez et gérez la liste des actions au national ou sur votre
            territoire</template
        >
        <template v-slot:actions>
            <p class="flex space-x-2">
                <Button
                    v-if="userStore.hasPermission('plan.export')"
                    icon="file-excel"
                    iconPosition="left"
                    variant="primary"
                    :loading="plansStore.exportCommentIsPending"
                    @click="exportPlanComments"
                    size="sm"
                    >Exporter tous les commentaires</Button
                >
                <Button
                    v-if="userStore.hasPermission('plan.create')"
                    href="/nouvelle_action"
                    icon="plus"
                    iconPosition="left"
                    variant="secondary"
                    size="sm"
                >
                    Déclarer une nouvelle action
                </Button>
                <Button
                    v-if="userStore.hasPermission('plan.export')"
                    icon="file-excel"
                    iconPosition="left"
                    variant="primary"
                    :loading="plansStore.exportPlanIsPending"
                    @click="exportAll"
                    size="sm"
                    >Exporter</Button
                >
            </p>
        </template>
    </ViewHeader>
</template>
<script setup>
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import { exportComments, exportPlans } from "@/api/plans.api";
import { Button } from "@resorptionbidonvilles/ui";
import { useUserStore } from "@/stores/user.store";
import { usePlansStore } from "@/stores/plans.store";
import { useNotificationStore } from "@/stores/notification.store";
const userStore = useUserStore();
const plansStore = usePlansStore();
const notificationStore = useNotificationStore();

async function exportAll() {
    if (plansStore.exportPlanIsPending === true) {
        return;
    }

    plansStore.exportPlanIsPending = true;

    try {
        const { csv } = await exportPlans();
        const hiddenElement = document.createElement("a");
        hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
        hiddenElement.target = "_blank";
        hiddenElement.download = "plans.csv";
        hiddenElement.click();
    } catch (err) {
        notificationStore.error(
            "Une erreur est survenue",
            "Une erreur est survenue durant l'export des actions"
        );
    }

    plansStore.exportPlanIsPending = false;
}

async function exportPlanComments() {
    if (plansStore.exportCommentIsPending === true) {
        return;
    }
    plansStore.exportCommentIsPending = true;
    try {
        const { csv } = await exportComments();
        const hiddenElement = document.createElement("a");
        hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
        hiddenElement.target = "_blank";
        hiddenElement.download = "messages.csv";
        hiddenElement.click();
    } catch (error) {
        let message = "Une erreur inconnue est survenue";
        if (error && error.user_message) {
            message = error.user_message;
        }
        notificationStore.error("Une erreur est survenue", message);
    }

    plansStore.exportCommentIsPending = false;
}
</script>
