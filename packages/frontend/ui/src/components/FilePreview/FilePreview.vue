<template>
    <div @mousemove="isHovered = true" @mouseleave="isHovered = false">
        <a class="flex border rounded p-1 space-x-2 items-center cursor-pointer hover:bg-blue100 bg-white"
        :title="`Consulter la pièce jointe, ${file.name}`" :href="file.urls.original">
            <FilePreviewIcon aria-hidden="true" class="flex-shrink-0" :file="file" />
            <div class="text-sm overflow-hidden flex-1">
                <p class="truncate" aria-hidden="true">{{ file.name }}</p>
                <p class="text-G700">
                    <span :aria-label="`Extension du fichier, ${file.extension?.toUpperCase()}`">{{ file.extension?.toUpperCase() }}</span>
                    -
                    <span :aria-label="`Taille du fichier, ${humanFileSize(file.size)}`">{{ humanFileSize(file.size) }}</span>
                </p>
            </div>
        </a>
        <Button
            :loading="file.loading === true"
            class="align-right rounded hover:!bg-primary px-2"
            :class="allowDeletion && (file.state === 'draft' || isHovered || file.loading === true) ? '' : 'hidden'"
            :title="`Supprimer la pièce jointe, ${file.name}`"
            type="button"
            icon="trash-alt"
            iconPosition="left"
            size="xs"
            @click.prevent="onDelete"
            variant="primaryOutlineAlt">
            Supprimer ce fichier
        </Button>
    </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import FilePreviewIcon from "./FilePreviewIcon.vue";
import humanFileSize from '../../utils/humanFileSize';
import Button from "../Button.vue";

const props = defineProps({
    file: {
        type: Object,
        required: true,
    },
    allowDeletion: {
        type: Boolean,
        default: false,
    },
});
const { file, allowDeletion } = toRefs(props);
const emit = defineEmits(["delete"]);
function onDelete() {
    if (file.value.state === 'draft' || confirm('Êtes-vous sûr(e) de vouloir supprimer ce fichier ?')) {
        emit('delete');
    }
}

const isHovered = ref(false);
</script>