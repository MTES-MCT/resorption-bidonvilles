<template>
    <div class="w-12 h-12 rounded-lg overflow-hidden relative flex items-center justify-center"
        :class="color ? `bg-${color.bg}` : 'bg-G300'">
        <img v-if="isImage" class="object-cover w-12 h-12 max-w-none absolute bg-white" :src="file.urls.preview" />
        <span class="text-xl" :class="color ? `text-${color.text}` : 'text-G700'">
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
    return file.value.extension?.match(/(jpe?g|png|gif)/i);
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
        null: 'file',
    };
    return icons[file.value.extension?.toLowerCase()] || 'file';
});
const color = computed(() => {
    const icons = {
        'file-image': null,
        'file-word': { text: 'primary', bg: 'blue200' },
        'file-excel': { text: 'green', bg: 'green100' },
        'file-pdf': { text: 'red', bg: 'red100' },
        file: null,
    };
    return icons[icon.value] || null;
});
</script>