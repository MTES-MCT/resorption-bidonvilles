<template>
    <Modal closeWhenClickOutside @close="onClose" ref="modale">
        <template v-slot:title>Exporter la fiche du site</template>
        <template v-slot:subtitle
            ><FicheSiteModaleSubtitle :town="town"
        /></template>
        <template v-slot:body>
            <FicheSiteModaleExportOptions :town="town" />
            <ErrorSummary class="mt-4" v-if="error" :message="error" />
        </template>

        <template v-slot:footer>
            <DsfrButton secondary @click="() => modale.close()" class="mr-2"
                >Annuler</DsfrButton
            >
            <DsfrButton
                icon="ri-file-word-fill"
                @click="download"
                :loading="isLoading"
                >Exporter la fiche du site</DsfrButton
            >
        </template>
    </Modal>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import { ErrorSummary, Modal } from "@resorptionbidonvilles/ui";
import { useNotificationStore } from "@/stores/notification.store";
import { trackEvent } from "@/helpers/matomo";
import formatDate from "@common/utils/formatDate";
import downloadBlob from "@/utils/downloadBlob";
import normalizeTownName from "@/utils/normalizeTownName";
import { exportSingle } from "@/api/towns.api";

import FicheSiteModaleExportOptions from "./FicheSiteModaleExportOptions.vue";
import FicheSiteModaleSubtitle from "../FicheSiteModaleSubtitle/FicheSiteModaleSubtitle.vue";
import { useForm } from "vee-validate";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const notificationStore = useNotificationStore();
const { values } = useForm({
    initialValues: {
        options: [],
    },
});
const isLoading = ref(false);
const error = ref(null);
const modale = ref(null);

async function download() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        const data = await exportSingle(town.value.id, values.options);

        const ts = Date.now() / 1000;
        downloadBlob(
            new Blob([data]),
            `${formatDate(ts, "y-m-d")}-fiche-site-${normalizeTownName(
                town.value.usename
            )}.docx`,
            {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }
        );
        trackEvent("Export", "Export fiche site", `S${town.value.id}`);
        notificationStore.success(
            "Export de la fiche site",
            "Le fichier d'export a bien été téléchargé"
        );
        modale.value.close();
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }

    isLoading.value = false;
}
</script>
