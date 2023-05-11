<template>
    <InputWrapper :hasErrors="!!error" :withoutMargin="withoutMargin" :id="name">
        <InputLabel :label="label" :info="info" :showMandatoryStar="showMandatoryStar" />
        <FilePreviewList class="mb-3" v-if="previews.length > 0" :files="previews" :collapse="false" />
        <input ref="fileInput" type="file" class="none"
            accept=".jpg,.jpeg,.png,.gif,.svg,.pdf,.doc,.docx,.xls,.xlsx,.odt,.odf" :multiple="multiple"
            @change="previewFiles" />
        <InputError v-if="!!error">{{ error }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import { useField } from "vee-validate";

import FilePreviewList from "../FilePreview/FilePreviewList.vue";
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";
import fromMimeToExtension from "../../utils/fromMimeToExtension";

const props = defineProps({
    name: String,
    label: String,
    info: String,
    showMandatoryStar: {
        type: Boolean,
        default: false,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    withoutMargin: {
        type: Boolean,
        default: false,
    },
});

const { name, label, info, multiple, withoutMargin } = toRefs(props);
const { error } = useField(name.value);
const fileInput = ref(null);

const rawFiles = ref([]);
const previews = computed(() => {
    return rawFiles.value.map(rawFile => ({
        state: 'draft',
        id: null,
        name: rawFile.name,
        size: rawFile.size,
        urls: {
            original: null,
            preview: rawFile.preview || null,
        },
        extension: fromMimeToExtension(rawFile.type),
    }));
});

function previewFiles() {
    rawFiles.value = Array.from(fileInput.value.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: null,
    }));

    for (let i = 0; i < fileInput.value.files.length; i += 1) {
        const file = fileInput.value.files[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            console.log('received preview');
            rawFiles.value[i] = { ...rawFiles.value[i], preview: event.target.result };
        };
    }
}
</script>