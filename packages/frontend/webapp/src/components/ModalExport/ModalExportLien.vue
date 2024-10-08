<template>
    <p>
        <Button
            v-if="isButton"
            @click="download"
            :loading="isLoading"
            :disabled="disabled"
        >
            <Icon icon="file-excel" iconPosition="left" />
            {{ label }}</Button
        >
        <Link v-else @click="download" :class="isLoading ? 'text-G300' : ''">
            <Icon icon="file-excel" class="mr-1" />
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
import {
    Button,
    Icon,
    Link,
    Spinner,
    Warning,
} from "@resorptionbidonvilles/ui";
import formatDate from "@common/utils/formatDate";

const props = defineProps({
    shape: {
        type: String,
        required: false,
        default: "link",
    },
    label: String,
    filename: String,
    downloadFn: Function,
    format: {
        type: String,
        required: false,
        default: "csv",
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    year: {
        type: Number,
        required: false,
        default: null,
    },
});
const { shape, label, filename, downloadFn, format, year } = toRefs(props);
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
        if (year.value) {
            console.log("Export des donées pour l'année", year.value);
        }

        const data = await downloadFn.value(year.value);

        if (format.value === "xlsx") {
            downloadBlob(
                new Blob([data]),
                `${formatDate(new Date().getTime() / 1000, "y-m-d")}-${
                    filename.value
                }-${year.value ? year.value : ""}-resorption-bidonvilles.xlsx`
            );
        } else {
            const { csv } = data;
            downloadCsv(
                csv,
                `${formatDate(new Date().getTime() / 1000, "y-m-d")}-${
                    filename.value
                }-resorption-bidonvilles.csv`
            );
        }

        notificationStore.success(
            label.value,
            "Le fichier d'exporta bien été téléchargé"
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

const isButton = computed(() => shape.value === "button");
</script>
