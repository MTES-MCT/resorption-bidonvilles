<template>
    <FilePreviewList
        :files="attachments"
        collapsedByDefault
        :onDelete="canDeleteAttachment ? onAttachmentDelete : null"
    />
</template>

<script setup>
import { computed, toRefs } from "vue";
import { FilePreviewList } from "@resorptionbidonvilles/ui";
import { useUserStore } from "@/stores/user.store";

const props = defineProps({
    attachments: Array,
});
const { attachments } = toRefs(props);

const canDeleteAttachment = computed(() => {
    const userStore = useUserStore();
    return userStore.canDeleteAttachment(attachments.value[0].created_by);
});

function onAttachmentDelete() {
    console.log("On supprime un attachment de question");
}
</script>
