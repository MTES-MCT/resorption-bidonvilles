<template>
    <a class="inline-block border rounded p-1 flex space-x-2 items-center cursor-pointer hover:bg-blue100 bg-white"
        @mousemove="isHovered = true" @mouseleave="isHovered = false" :title="file.name" :href="file.urls.original">
        <FilePreviewIcon class="flex-shrink-0" :file="file" />
        <div class="text-sm overflow-hidden flex-1">
            <p class="truncate">{{ file.name }}</p>
            <p class="text-G500"><span>{{ file.extension?.toUpperCase() }}</span> {{ humanFileSize(file.size) }}</p>
        </div>
        <!-- <Button v-if="onDelete" :class="(file.state === 'draft' || isHovered) ? 'visible' : 'invisible'" type="button"
            icon="trash-alt" size="sm" @click.prevent="handleDelete" variant="primaryOutlineAlt" /> -->
    </a>
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
    onDelete: {
        type: Function,
        required: false,
    },
});
const { file, onDelete } = toRefs(props);

const isHovered = ref(false);
const deleteIsLoading = ref(false);

async function handleDelete() {
    if (deleteIsLoading.value === true) {
        return;
    }

    if (!onDelete.value) {
        return;
    }

    deleteIsLoading.value = true;
    try {
        await onDelete.value(file.value);
    } catch (error) {
        // ignore : la gestion d'erreur doit être faite par le composant qui fournit onDelete()
    }

    deleteIsLoading.value = false;
}
</script>