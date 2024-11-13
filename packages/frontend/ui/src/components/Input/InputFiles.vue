<template>
    <InputWrapper :hasErrors="errors.length > 0" :withoutMargin="withoutMargin" :id="name">
        <Icon v-if="icon" :icon="icon" class="mr-2" />
        <InputLabel :label="label"
            :info="`Les images, les documents PDF, Word, et Excel sont autorisés. La taille maximale autorisée est de ${humanFileSize(MAX_FILE_SIZE)}.`"
            :showMandatoryStar="showMandatoryStar" />
        <FilePreviewGrid class="mb-3" v-if="previews.length > 0" :files="previews" allowDeletion @deleteFile="onDeleteFile" />
        <input ref="fileInput" type="file" class="none" :accept="allowedFileExtensions.map(ext => `.${ext}`).join(',')"
            :multiple="multiple" @change="onChange" @focus="onFocus" @blur="handleBlur" />
        <InputError v-if="errors.length > 0">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { computed, ref, toRefs, onMounted, onUnmounted, watch } from "vue";
import { useField } from "vee-validate";
import allowedFileExtensions from "@common/utils/allowed_file_extensions";
import fromMimeToExtension from "@common/utils/fromMimeToExtension";
import { MAX_FILE_SIZE } from "@common/utils/max_file_size";
import humanFileSize from "../../utils/humanFileSize";
import getRandomString from "../../utils/getRandomString";
import { Icon } from "@resorptionbidonvilles/ui";

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
    icon: {
        type: String,
        default: null,
        mandatory: false,
    }
});

const { name, label, multiple, withoutMargin, icon } = toRefs(props);
const { handleChange, handleBlur, errors, value } = useField(name.value);
const fileInput = ref(null);

watch(value, () => {
    syncEnrichedFileListWith(value.value);
});

// cette fonction met à jour enrichedFileList (qui est l'ancienne valeur du champ)
// pour se synchroniser avec fileList (la nouvelle valeur du champ)
async function syncEnrichedFileListWith(fileList) {
    // on génére les previews, nécessaires pour comparer les fichiers entre eux
    const enrichedFiles = await enrichFiles(fileList);

    // on supprime de l'ancienne valeur tous les fichiers qui ne sont plus dans la nouvelle valeur
    for (let i = 0; i < enrichedFileList.value.length; i += 1) {
        let exists = false;
        for (let j = 0; j < enrichedFiles.length; j += 1) {
            if (enrichedFileList.value[i].preview === enrichedFiles[j].preview) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            enrichedFileList.value.splice(i, 1);
            i -= 1;
        }
    }

    // on rajoute tous les nouveaux fichiers trouvés dans la nouvelle valeur
    for (let i = 0; i < enrichedFiles.length; i += 1) {
        if (!fileExistsInEnrichedFilelist(enrichedFiles[i])) {
            enrichedFileList.value.push(enrichedFiles[i]);
        }
    }

    // on met à jour l'input également
    fileInput.value.files = fileList;
}

const enrichedFileList = ref([]);
const isFocused = ref(false);
const previews = computed(() => {
    return enrichedFileList.value.map((file) => ({
        state: 'draft',
        id: null,
        name: file.raw.name,
        size: file.raw.size,
        urls: {
            original: null,
            preview: file.preview || null,
        },
        extension: fromMimeToExtension(file.raw.type),
        created_by: null,
    }));
});

// les différents modes de mise à jour de la liste des fichiers
// soit "native" (depuis l'input file)
// soit "manual" (manuellement via un drag & drop par exemple)
const CHANGE_TYPE = {
    NATIVE: 0,
    MANUAL: 1,
};

function onChange() {
    processInputFileList(fileInput.value.files, CHANGE_TYPE.NATIVE);
}

async function processInputFileList(fileList, changeType) {
    const enrichedFiles = await enrichFiles(fileList);
    insertFilesIntoEnrichedFilelist(enrichedFiles);
    handleChange(getActualFileList());

    if (changeType === CHANGE_TYPE.MANUAL) {
        fileInput.value.files = fileList;
    }
}

function getActualFileList() {
    const dt = new DataTransfer();
    for (let i = 0; i < enrichedFileList.value.length; i++) {
        dt.items.add(enrichedFileList.value[i].raw);
    }

    return dt.files;
}

async function enrichFiles(fileList) {
    // on génère les previews
    const previewPromises = [];
    for (let i = 0; i < fileList.length; i += 1) {
        previewPromises.push(new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(fileList[i]);
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.onabort = () => {
                reject('aborted');
            };
        }));
    }

    const previews = await Promise.all(previewPromises);

    // on génère un tableau de fichiers enrichis
    const enrichedFiles = [];
    for (let i = 0; i < fileList.length; i += 1) {
        enrichedFiles.push({
            raw: fileList[i],
            preview: previews[i],
        });
    }

    return enrichedFiles;
}

function insertFilesIntoEnrichedFilelist(enrichedFiles) {
    // on ajoute à filelist uniquement les fichiers qui n'y sont pas déjà
    for (let i = 0; i < enrichedFiles.length; i++) {
        if (fileExistsInEnrichedFilelist(enrichedFiles[i]) === true) {
            continue;
        }

        enrichedFileList.value.push(enrichedFiles[i]);
    }
}

function fileExistsInEnrichedFilelist(enrichedFile) {
    return enrichedFileList.value.some((file) => enrichedFile.preview === file.preview);
}

function onDeleteFile(file, index) {
    const dt = new DataTransfer();

    // on recrée un set de données en excluant le fichier à supprimer
    for (let i = 0; i < enrichedFileList.value.length; i++) {
        if (index !== i) {
            dt.items.add(enrichedFileList.value[i].raw);
        }
    }

    // on change la valeur de l'input avec le nouveau set de données
    fileInput.value.files = dt.files;

    // on supprime l'item du tableau
    enrichedFileList.value.splice(index, 1);

    // on update auprès de vee-validate
    handleChange(getActualFileList());
}

function addFiles(newFiles) {
    const dt = new DataTransfer();
    for (let i = 0; i < newFiles.length; i += 1) {
        dt.items.add(newFiles[i]);
    }

    processInputFileList(dt.files, CHANGE_TYPE.MANUAL);
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

defineExpose({
    isFocused,
    addFiles,
});
</script>