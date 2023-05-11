<template>
    <div class="w-12 h-12 bg-G300 rounded-lg border overflow-hidden relative flex items-center justify-center">
        <img v-if="isImage" class="object-cover w-12 h-12 max-w-none absolute" :src="file.urls.preview" />
        <span class="text-xl text-G600">
            <Icon :icon="icon" />
        </span>
    </div>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    file: {
        type: Object,
        required: true,
    },
});
const { file } = toRefs(props);

const isImage = computed(() => {
    return file.value.extension.match(/(jpe?g|png|gif|svg)/i);
});
const icon = computed(() => {
    if (isImage.value) {
        return 'file-image';
    }

    const icons = {
        pdf: 'file-pdf',
        doc: 'file-word',
        docx: 'file-word',
        odt: 'file-word',
        xls: 'file-excel',
        xlsx: 'file-excel',
        odf: 'file-excel',
    };
    return icons[file.value.extension.toLowerCase()] || 'file';
});
</script>