<template>
    <FilePreviewList :files="attachments" collapsedByDefault />
</template>

<script setup>
import { toRefs } from "vue";
import { FilePreviewList } from "@resorptionbidonvilles/ui";

const props = defineProps({
    attachments: Array,
});
const { attachments } = toRefs(props);
</script>
