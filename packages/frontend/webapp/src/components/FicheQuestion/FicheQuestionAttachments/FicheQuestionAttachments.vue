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
</script>
