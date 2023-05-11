<template>
    <a class="inline-block border rounded p-1 flex space-x-2 items-center cursor-pointer hover:bg-blue100"
        :title="file.name" :href="file.urls.original">
        <FilePreviewIcon class="flex-shrink-0" :file="file" />
        <div class="text-sm overflow-hidden">
            <p class="truncate">{{ file.name }}</p>
            <p class="text-G500"><span>{{ file.extension }}</span> {{ humanFileSize(file.size) }}</p>
        </div>
    </a>
</template>

<script setup>
import { toRefs } from 'vue';
import FilePreviewIcon from "./FilePreviewIcon.vue";
import humanFileSize from '../../utils/humanFileSize';

const props = defineProps({
    file: {
        type: Object,
        required: true,
    },
});
const { file } = toRefs(props);
</script>