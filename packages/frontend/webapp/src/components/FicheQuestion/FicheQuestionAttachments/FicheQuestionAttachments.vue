<template>
    <FilePreviewList
        :files="attachments"
        :allowDeletion="isOwnerOfQuestion"
        @deleteFile="onDeleteAttachment"
    />
</template>

<script setup>
import { toRefs } from "vue";
import { FilePreviewList } from "@resorptionbidonvilles/ui";

const props = defineProps({
    attachments: Array,
});
const { attachments } = toRefs(props);
const isOwnerOfQuestion = false;

function onDeleteAttachment(file, index) {
    console.log("deleting from question store", file, index);
}
</script>
