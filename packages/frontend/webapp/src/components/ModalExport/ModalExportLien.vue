<template>
    <DsfrButton
        v-if="isButton"
        :label="label"
        icon="ri:file-excel-fill"
        :disabled="disabled || isLoading"
        @click="download"
    />
    <div v-else>
        <button
            type="button"
            class="fr-link"
            :class="{ 'fr-text-disabled--grey': isLoading }"
            :aria-disabled="isLoading"
            @click="download"
        >
            <VIcon
                name="ri:file-excel-fill"
                class="fr-mr-1v"
                aria-hidden="true"
            />
            {{ label }}
        </button>
        <!-- <output> permanent (région live) : seul son contenu dépend de isLoading. -->
        <output :class="{ 'fr-ml-1w': isLoading }">
            <template v-if="isLoading">
                <Spinner aria-hidden="true" />
                <span class="fr-sr-only">Téléchargement en cours</span>
            </template>
        </output>
    </div>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import { useNotificationStore } from "@/stores/notification.store";
import downloadCsv from "@/utils/downloadCsv";
import downloadBlob from "@/utils/downloadBlob";
import { Spinner } from "@resorptionbidonvilles/ui";
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

const isLoading = ref(false);

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

const isButton = computed(function computeIsButton() {
    return shape.value === "button";
});
</script>
