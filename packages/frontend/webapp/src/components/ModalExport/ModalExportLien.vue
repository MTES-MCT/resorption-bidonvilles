<template>
    <p>
        <Link @click="download" :class="isLoading ? 'text-G300' : ''">
            <Icon icon="file-pdf" class="mr-1" />
            {{ label }} </Link
        ><Spinner class="ml-2" v-if="isLoading" /><br />
        <Warning v-if="error" :autohide="false">{{ error }}</Warning>
    </p>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import { useNotificationStore } from "@/stores/notification.store";
import downloadCsv from "@/utils/downloadCsv";
import { Icon, Link, Spinner, Warning } from "@resorptionbidonvilles/ui";

const props = defineProps({
    label: String,
    filename: String,
    downloadFn: Function,
});
const { label, filename, downloadFn } = toRefs(props);
const notificationStore = useNotificationStore();

const isLoading = ref(null);
const error = ref(null);

async function download() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        const { csv } = await downloadFn.value();
        downloadCsv(csv, `${filename.value}.csv`);
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
