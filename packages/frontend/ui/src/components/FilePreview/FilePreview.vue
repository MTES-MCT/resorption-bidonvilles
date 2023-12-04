<template>
    <div class="inline-block border rounded p-1 flex space-x-2 items-center"
        :class="[!isStatusDraft ? 'cursor-pointer hover:bg-blue100 bg-white' : '']"
        :tabindex="`${isStatusDraft ? '-1' : '0'}`" @keyup.enter="displayAttachment(file)" @click="displayAttachment(file)">
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
    </div>
</template>

<script setup>
import { ref, toRefs, computed } from 'vue';
import FilePreviewIcon from "./FilePreviewIcon.vue";
import humanFileSize from '../../utils/humanFileSize';
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
    }
}

const isStatusDraft = computed(() => {
    return file.value.state === 'draft';
});
</script>