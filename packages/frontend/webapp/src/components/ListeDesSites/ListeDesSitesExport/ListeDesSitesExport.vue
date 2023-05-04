<template>
    <Modal :isOpen="isOpen" closeWhenClickOutside @close="close">
        <template v-slot:title>Exporter les {{ title }}</template>
        <template v-slot:body>
            <ListeDesSitesExportSummary />
            <ListeDesSitesExportDate
                v-if="canExportHistory"
                v-model:date="date"
            />
            <ListeDesSitesExportOptions :disabled="!isExportToday" />
            <ErrorSummary class="mt-4" v-if="error" :message="error" />
        </template>

        <template v-slot:footer>
            <Button variant="primaryOutline" @click="close" class="mr-2"
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
import { ref, computed, defineExpose } from "vue";
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

const notificationStore = useNotificationStore();
const townsStore = useTownsStore();
const userStore = useUserStore();
const isOpen = ref(false);
const isLoading = ref(false);
const error = ref(null);
const date = ref(new Date());
const isClosed = computed(() => townsStore.filters.status === "close");
const title = computed(() => {
    return isClosed.value ? "sites fermés" : "sites existants";
});
const canExportHistory = computed(() => {
    return userStore.hasPermission("shantytown_history.export");
});
const isExportToday = computed(() => {
    const today = formatDate(Date.now() / 1000, "d/m/y");
    const exportDate = formatDate(date.value?.getTime() / 1000, "d/m/y");
    return today === exportDate;
});

function close() {
    isOpen.value = false;
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
            date.value
        );
        downloadBlob(
            new Blob([data]),
            `${formatDate(date.value.getTime() / 1000, "y-m-d")}-sites-${
                isClosed.value ? "fermés" : "existants"
            }-resorption-bidonvilles.xlsx`
        );
        trackEvent("Export", "Export sites");
        close();
        notificationStore.success(
            "Export des sites",
            "Le fichier d'export a bien été téléchargé"
        );
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }

    isLoading.value = false;
}

defineExpose({
    open() {
        isOpen.value = true;
    },
});
</script>
