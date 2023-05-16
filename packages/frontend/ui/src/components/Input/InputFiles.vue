<template>
    <InputWrapper :hasErrors="errors.length > 0" :withoutMargin="withoutMargin" :id="name">
        <InputLabel :label="label"
            :info="`Les images, les documents PDF, Word, et Excel sont autorisés. La taille maximale autorisée est de ${humanFileSize(MAX_FILE_SIZE)}.`"
            :showMandatoryStar="showMandatoryStar" />
        <FilePreviewGrid class="mb-3" v-if="previews.length > 0" :files="previews" @delete="onDelete" />
        <input ref="fileInput" type="file" class="none" :accept="allowedFileExtensions.map(ext => `.${ext}`).join(',')"
            :multiple="multiple" @change="onChange" @blur="handleBlur" />
        <InputError v-if="errors.length > 0">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import { useField } from "vee-validate";
import allowedFileExtensions from "@common/utils/allowed_file_extensions";
import fromMimeToExtension from "@common/utils/fromMimeToExtension";
import { MAX_FILE_SIZE } from "@common/utils/max_file_size";
import humanFileSize from "../../utils/humanFileSize";

import FilePreviewGrid from "../FilePreview/FilePreviewGrid.vue";
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";

const props = defineProps({
    name: String,
    label: String,
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

const { name, label, multiple, withoutMargin } = toRefs(props);
const { handleChange, handleBlur, errors } = useField(name.value);
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
        created_by: null,
    }));
});

function onChange() {
    rawFiles.value = Array.from(fileInput.value.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: null,
    }));

    handleChange(fileInput.value.files);
    previewFiles();
}

function onDelete(file, index) {
    const dt = new DataTransfer();
    const { files } = fileInput.value;

    // on recrée un set de données en excluant le fichier à supprimer
    for (let i = 0; i < files.length; i++) {
        if (index !== i) {
            dt.items.add(files[i]);
        }
    }

    // on change la valeur de l'input avec le nouveau set de données
    fileInput.value.files = dt.files;

    // on génère un "change"
    onChange();
}

function previewFiles() {
    for (let i = 0; i < fileInput.value.files.length; i += 1) {
        const file = fileInput.value.files[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            rawFiles.value[i] = { ...rawFiles.value[i], preview: event.target.result };
        };
    }
}
</script>