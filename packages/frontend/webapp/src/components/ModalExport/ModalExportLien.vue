<template>
    <p>
        <Link @click="download" :class="isLoading ? 'text-G300' : ''">
            <Icon :icon="exportIcon" class="mr-1" />
            {{ label }} </Link
        ><Spinner class="ml-2" v-if="isLoading" /><br />
        <Warning v-if="error" :autohide="false">{{ error }}</Warning>
    </p>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import { useNotificationStore } from "@/stores/notification.store";
import downloadCsv from "@/utils/downloadCsv";
import downloadBlob from "@/utils/downloadBlob";
import { Icon, Link, Spinner, Warning } from "@resorptionbidonvilles/ui";

const props = defineProps({
    label: String,
    filename: String,
    downloadFn: Function,
    format: {
        type: String,
        required: false,
        default: "csv",
    },
});
const { label, filename, downloadFn, format } = toRefs(props);
const notificationStore = useNotificationStore();

const isLoading = ref(null);
const error = ref(null);

const exportIcon = computed(() => {
    const formatIcons = {
        xlsx: "file-excel",
        csv: "file-csv",
        pdf: "file-pdf",
    };
    return formatIcons[format.value] || "file-csv";
});

async function download() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        const data = await downloadFn.value();

        if (format.value === "xlsx") {
            downloadBlob(new Blob([data]), `${filename.value}.xlsx`);
        } else {
            const { csv } = data;
            downloadCsv(csv, `${filename.value}.csv`);
        }

        notificationStore.success(
            label.value,
            "Le fichier a bien été téléchargé"
        );
    } catch (e) {
        error.value = "Le téléchargement a des données échoué";
        notificationStore.error(
            label.value,
            e?.user_message || "Une erreur inconnue est survenue"
        );
    }

    isLoading.value = false;
}
</script>
