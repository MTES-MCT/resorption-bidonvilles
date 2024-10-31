<template>
    <div class="bg-blue-100 p-4">
        <InputFiles
            :name="type + '_attachments'"
            :label="labels[type + '_upload']"
            :multiple="true"
            ref="input"
            @change="updateAttachments"
        />
        <FilePreviewGrid
            class="mb-3"
            v-if="filteredFiles.length > 0"
            :files="filteredFiles"
            allowDeletion
            @deleteFile="onDeleteFile"
        />
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { InputFiles } from "@resorptionbidonvilles/ui";
import FilePreviewGrid from "@resorptionbidonvilles/ui/src/components/FilePreview/FilePreviewGrid.vue";
import labels from "@/components/Common/FormEtFicheSite.labels";
import { useTownsStore } from "@/stores/towns.store";
import { useNotificationStore } from "@/stores/notification.store";

const props = defineProps({
    type: String,
    modelValue: Array,
    townId: Number,
});

const { type, modelValue, townId } = toRefs(props);

const filteredFiles = computed(() => {
    return (
        modelValue.value?.attachments.filter(
            (file) => file.type === type.value
        ) || []
    );
});

const onDeleteFile = async (file) => {
    const townStore = useTownsStore();
    const notificationStore = useNotificationStore();
    try {
        modelValue.value.attachments = await townStore.deleteDecreeAttachment(
            file,
            townId.value
        );
        notificationStore.success(
            "Succès",
            "La pièce jointe a bien été supprimée"
        );
    } catch (error) {
        notificationStore.error(
            "Erreur",
            "Une erreur est survenue lors de la suppression de la pièce jointe"
        );
    }
};
</script>
