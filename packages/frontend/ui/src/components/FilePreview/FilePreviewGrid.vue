<template>
    <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-2 mt-1">
        <FilePreview
            v-for="(file, index) in files"
            :key="file.id"
            :file="file"
            :allowDeletion="allowDeletion"
            @delete="emit('deleteFile', file, index)"
        />
    </div>
</template>

<script setup>
import { toRefs } from 'vue';
import FilePreview from "./FilePreview.vue";

const props = defineProps({
    files: {
        type: Array,
        default() {
            return [];
        },
    },
    allowDeletion: {
        type: Boolean,
        default: false,
    }
});
const { files, allowDeletion } = toRefs(props);
const emit = defineEmits(["deleteFile"]);
</script>