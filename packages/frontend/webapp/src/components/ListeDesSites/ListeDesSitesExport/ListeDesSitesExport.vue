<template>
    <Modal closeWhenClickOutside @close="onClose" ref="modale">
        <template v-slot:title
            >Exporter les sites {{ whichTownsAreExported.label }}</template
        >
        <template v-slot:body>
            <ListeDesSitesExportSummary v-if="isExportToday" />
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
                >{{ exportButtonLabel }}</Button
            >
        </template>
    </Modal>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
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

onMounted(() => {
    townsStore.exportOptions.splice(0);
});

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
const whichTownsAreExported = computed(() => {
    switch (townsStore.filters.status) {
        case "open":
            return {
                status: "open",
                label: "existants",
            };
        case "close":
            if (
                townsStore.filters.properties.resorbedOrClosed.includes(
                    "resorbed"
                ) &&
                !townsStore.filters.properties.resorbedOrClosed.includes(
                    "closed"
                )
            ) {
                return {
                    status: "resorbed",
                    label: "résorbés",
                };
            }
            return {
                status: "closed",
                label: "fermés",
            };
        case "inProgress":
            return {
                status: "inProgress",
                label: "en cours de résorption",
            };
        default:
            return "";
    }
});
const canExportHistory = computed(() => {
    return userStore.hasPermission("shantytown_history.export");
});
const isExportToday = computed(() => {
    const today = formatDate(Date.now() / 1000, "d/m/y");
    const exportDate = formatDate(values.date?.getTime() / 1000, "d/m/y");
    return today === exportDate;
});

const exportButtonLabel = computed(() => {
    if (isExportToday.value) {
        const count = townsStore.filteredTowns.length;
        if (count === 1) {
            return "Exporter le site";
        }
        return `Exporter les ${count} sites`;
    }
    return "Exporter les sites";
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
            whichTownsAreExported.value.status,
            townsStore.exportOptions,
            values.date,
            townsStore.filters.properties
        );
        downloadBlob(
            new Blob([data]),
            `${formatDate(values.date.getTime() / 1000, "y-m-d")}-sites-${
                whichTownsAreExported.value.label
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
