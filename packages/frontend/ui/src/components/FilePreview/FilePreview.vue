<template>
    <div class="inline-block border rounded p-1 flex space-x-2 items-center cursor-pointer hover:bg-blue100 bg-white"
        tabindex="0" @keyup.enter="displayAttachment(file)" @click="displayAttachment(file)">
        <FilePreviewIcon aria-hidden="true" class="flex-shrink-0" :file="file" />
        <span class="sr-only">Cliquer pour consulter la pièce jointe, {{ file.name }}</span>
        <div class="text-sm overflow-hidden flex-1">
            <p aria-hidden="true" class="truncate">{{ file.name }}</p>
            <p class="text-G500">
                <span :aria-label="`Extension du fichier, ${file.extension?.toUpperCase()}`">{{
                    file.extension?.toUpperCase() }}</span> -
                <span :aria-label="`Taille du fichier, ${humanFileSize(file.size)}`">{{ humanFileSize(file.size) }}</span>
            </p>
        </div>
        <Button
            :class="(file.state === 'draft' || file.createdByCurrentUser || isHovered) && !disallowAttachmentsRemoval ? 'visible' : 'invisible'"
            type="button" icon="trash-alt" size="sm" @click.stop="$emit('delete')" variant="primaryOutlineAlt"
            :title="`Supprimer la pièce jointe, ${file.name}`" />
    </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import FilePreviewIcon from "./FilePreviewIcon.vue";
import humanFileSize from '../../utils/humanFileSize';
import Button from "../Button.vue";
import { useNotificationStore } from "@/stores/notification.store";

const props = defineProps({
    file: {
        type: Object,
        required: true,
    },
    disallowAttachmentsRemoval: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const { disallowAttachmentsRemoval, file } = toRefs(props);

const isHovered = ref(false);

function displayAttachment(file) {
    if (file.state !== 'draft') {
        window.open(file.urls.original);
    } else {
        const notificationStore = useNotificationStore();
        notificationStore.error(
            "Visualiser une pièce jointe",
            "Il n'est pas possible de visualiser une pièce-jointe non enregistrée"
        );
    }
}
</script>