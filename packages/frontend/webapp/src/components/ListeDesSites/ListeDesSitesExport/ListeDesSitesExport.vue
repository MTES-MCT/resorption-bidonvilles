<template>
    <Modal closeWhenClickOutside @close="onClose" ref="modale">
        <template v-slot:title>Exporter les {{ title }}</template>
        <template v-slot:body>
            <ListeDesSitesExportSummary />
            <ListeDesSitesExportDate v-if="canExportHistory" />
            <ListeDesSitesExportOptions :disabled="!isExportToday" />
            <ErrorSummary class="mt-4" v-if="error" :message="error" />
        </template>

        <template v-slot:footer>
            <Button
                variant="primaryOutline"
                @click="() => modale.close()"
                class="!border-2 !border-primary hover:!bg-primaryDark mr-2"
                >Annuler</Button
            >
            <Button
                icon="file-excel"
                iconPosition="left"
                @click="download"
                :loading="isLoading"
                >Exporter les
                {{ townsStore.filteredTowns.length }} sites</Button
            >
        </template>
    </Modal>
</template>

<script setup>
import { ref, computed } from "vue";
import { useForm } from "vee-validate";
import { Button, ErrorSummary, Modal } from "@resorptionbidonvilles/ui";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import { trackEvent } from "@/helpers/matomo";
import formatDate from "@common/utils/formatDate";
import downloadBlob from "@/utils/downloadBlob";
import { exportList } from "@/api/towns.api";

import ListeDesSitesExportSummary from "./ListeDesSitesExportSummary.vue";
import ListeDesSitesExportDate from "./ListeDesSitesExportDate.vue";
import ListeDesSitesExportOptions from "./ListeDesSitesExportOptions.vue";

const { values } = useForm({
    initialValues: {
        date: new Date(),
    },
});
const notificationStore = useNotificationStore();
const townsStore = useTownsStore();
const userStore = useUserStore();
const modale = ref(null);
const isLoading = ref(false);
const error = ref(null);
const isClosed = computed(() => townsStore.filters.status === "close");
const title = computed(() => {
    return isClosed.value ? "sites fermés" : "sites existants";
});
const canExportHistory = computed(() => {
    return userStore.hasPermission("shantytown_history.export");
});
const isExportToday = computed(() => {
    const today = formatDate(Date.now() / 1000, "d/m/y");
    const exportDate = formatDate(values.date?.getTime() / 1000, "d/m/y");
    return today === exportDate;
});

function onClose() {
    isLoading.value = false;
    error.value = null;
}

async function download() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        const data = await exportList(
            {
                type: townsStore.filters.location?.typeUid || "nation",
                code: townsStore.filters.location?.code || null,
            },
            isClosed.value,
            townsStore.exportOptions,
            values.date
        );
        downloadBlob(
            new Blob([data]),
            `${formatDate(values.date.getTime() / 1000, "y-m-d")}-sites-${
                isClosed.value ? "fermés" : "existants"
            }-resorption-bidonvilles.xlsx`
        );
        trackEvent("Export", "Export sites");
        notificationStore.success(
            "Export des sites",
            "Le fichier d'export a bien été téléchargé"
        );
        modale.value.close();
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }

    isLoading.value = false;
}
</script>
<style scoped>
button {
    border: inherit;
}
</style>
