<template>
    <InputWrapper :hasErrors="errors.length > 0" :withoutMargin="withoutMargin" :id="name">
        <InputLabel :label="label"
            :info="`Les images, les documents PDF, Word, et Excel sont autorisés. La taille maximale autorisée est de ${humanFileSize(MAX_FILE_SIZE)}.`"
            :showMandatoryStar="showMandatoryStar" />
        <FilePreviewGrid class="mb-3" v-if="previews.length > 0" :files="previews" @delete="onDelete" />
        <input ref="fileInput" type="file" class="none" :accept="allowedFileExtensions.map(ext => `.${ext}`).join(',')"
            :multiple="multiple" @change="onChange" @focus="onFocus" @blur="handleBlur" />
        <InputError v-if="errors.length > 0">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { computed, ref, toRefs, watch, onMounted, onUnmounted } from "vue";
import { useField } from "vee-validate";
import allowedFileExtensions from "@common/utils/allowed_file_extensions";
import fromMimeToExtension from "@common/utils/fromMimeToExtension";
import { MAX_FILE_SIZE } from "@common/utils/max_file_size";
import humanFileSize from "../../utils/humanFileSize";
import getRandomString from "../../utils/getRandomString";

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
const { handleChange, handleBlur, errors, value } = useField(name.value);
const fileInput = ref(null);

const rawFiles = ref([]);
const isFocused = ref(false);
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

function processRawFiles() {
    rawFiles.value = Array.from(fileInput.value.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: null,
    }));
}

function onChange() {
    processRawFiles();
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

function listenWindowFocus() {
    if (window.focusedInputFile !== randomId) {
        return;
    }

    isFocused.value = false;

    // un événement "focus" est triggered automatiquement à la fermeture de modale de sélection
    // d'un fichier
    // on ne souhaite pas que cet événement soit pris en compte donc deux choses :
    // 1. on ignore le focus pendant 250ms
    // 2. on blur l'input pour retirer l'état focused intégré par le browser
    ignoreFocus = true;
    setTimeout(() => {
        ignoreFocus = false;
        fileInput.value.blur();
    }, 250);
}

let randomId = "";
let ignoreFocus = false;
onMounted(() => {
    randomId = getRandomString(40);
    ignoreFocus = false;
    isFocused.value = false;

    window.addEventListener('focus', listenWindowFocus);
});
onUnmounted(() => {
    window.removeEventListener('focus', listenWindowFocus);
});

function onFocus() {
    if (ignoreFocus === true) {
        return;
    }

    window.focusedInputFile = randomId;
    isFocused.value = true;
}

watch(value, () => {
    fileInput.value.files = value.value instanceof FileList ? value.value : new DataTransfer().files;
    processRawFiles();
});

defineExpose({
    isFocused,
});
</script>