<template>
    <a class="inline-block border rounded p-1 flex space-x-2 items-center cursor-pointer hover:bg-blue100 bg-white"
        @mousemove="isHovered = true" @mouseleave="isHovered = false" :title="file.name" :href="file.urls.original">
        <FilePreviewIcon class="flex-shrink-0" :file="file" />
        <div class="text-sm overflow-hidden flex-1">
            <p class="truncate">{{ file.name }}</p>
            <p class="text-G500"><span>{{ file.extension?.toUpperCase() }}</span> {{ humanFileSize(file.size) }}</p>
        </div>
        <Button
            :class="allowDeletion && (file.state === 'draft' || isHovered) ? 'visible' : 'invisible'"
            type="button" icon="trash-alt" size="sm" @click.prevent="emit('delete')" variant="primaryOutlineAlt" />
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
    allowDeletion: {
        type: Boolean,
        default: false,
    },
});
const { file, allowDeletion } = toRefs(props);
const emit = defineEmits(["delete"]);

const isHovered = ref(false);
</script>