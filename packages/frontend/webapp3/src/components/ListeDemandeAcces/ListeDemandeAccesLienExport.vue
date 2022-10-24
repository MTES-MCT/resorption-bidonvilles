<template>
    <p>
        <Link @click="download" :class="isLoading ? 'text-G300' : ''">
            <Icon icon="file-pdf" class="mr-1" />
            {{ label }} </Link
        ><Spinner class="ml-2" v-if="isLoading" /><br />
        <Warning v-if="error" :autohide="false">{{ error }}</Warning>
    </p>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import downloadFile from "@/utils/downloadFile";
import { Icon, Link, Spinner, Warning } from "@resorptionbidonvilles/ui";

const props = defineProps({
    label: String,
    filename: String,
    downloadFn: Function,
});
const { label, filename, downloadFn } = toRefs(props);

const isLoading = ref(null);
const error = ref(null);

async function download() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        const { csv } = await downloadFn.value();
        downloadFile(csv, `${filename.value}.csv`);
    } catch (e) {
        error.value = "Le téléchargement a des données échoué";
    }

    isLoading.value = false;
}
</script>
