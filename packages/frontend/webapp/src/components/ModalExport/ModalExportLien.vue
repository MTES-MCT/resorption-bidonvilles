<template>
    <p>
        <DsfrButton
            v-if="isButton"
            @click="download"
            :disabled="disabled || isLoading"
        >
            <Icon icon="file-excel" iconPosition="left" />
            {{ label }}</DsfrButton
        >
        <template v-else>
            <Link @click="download" :class="isLoading ? 'text-G300' : ''">
                <Icon icon="file-excel" class="mr-1" />
                {{ label }} </Link
            ><Spinner class="ml-2" v-if="isLoading" /><br />
        </template>
    </p>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import { useNotificationStore } from "@/stores/notification.store";
import downloadCsv from "@/utils/downloadCsv";
import downloadBlob from "@/utils/downloadBlob";
import { Icon, Link, Spinner } from "@resorptionbidonvilles/ui";
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
const emit = defineEmits(["export-error"]);
const notificationStore = useNotificationStore();

const isLoading = ref(null);

function notifyParentError(message) {
    emit("export-error", message);
}

async function download() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    notifyParentError(null);
    try {
        const data = await downloadFn.value(year.value);
        const exportDate = formatDate(Date.now() / 1000, "y-m-d");

        if (format.value === "xlsx") {
            downloadBlob(
                new Blob([data]),
                `${exportDate}-${filename.value}-${
                    year.value ? year.value : ""
                }-resorption-bidonvilles.xlsx`
            );
        } else {
            const { csv } = data;
            downloadCsv(
                csv,
                `${exportDate}-${filename.value}-resorption-bidonvilles.csv`
            );
        }

        notificationStore.success(
            label.value,
            "Le fichier d'export a bien été téléchargé"
        );
    } catch (e) {
        notifyParentError(
            e?.user_message || "Le téléchargement des données a échoué"
        );
        notificationStore.error(
            label.value,
            e?.user_message || "Une erreur inconnue est survenue"
        );
    }

    isLoading.value = false;
}

const isButton = computed(() => shape.value === "button");
</script>
