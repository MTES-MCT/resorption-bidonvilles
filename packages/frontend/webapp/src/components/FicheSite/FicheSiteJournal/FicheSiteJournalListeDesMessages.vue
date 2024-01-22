<template>
    <section>
        <FicheSiteJournalGroupeCommentaire
            v-for="comment in enrichedComments"
            :key="comment.id"
            :comment="comment"
            :townId="townId"
            :disallowAttachmentsRemoval="!comment.isAllowedToDeleteAttachment"
        />
    </section>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import FicheSiteJournalGroupeCommentaire from "./FicheSiteJournalGroupeCommentaire.vue";
import { useUserStore } from "@/stores/user.store";
import { useTownsStore } from "@/stores/towns.store";

const props = defineProps({
    comments: Array,
    townId: Number,
});
const { comments, townId } = toRefs(props);
const userStore = useUserStore();
const townsStore = useTownsStore();

const enrichedComments = computed(() => {
    return comments.value.map((comment) => {
        return {
            ...comment,
            isAllowedToDeleteAttachment: canUserDeleteSiteCommentAttachment(
                comment.createdBy.id
            ),
        };
    });
});

function canUserDeleteSiteCommentAttachment(commentOwnerId) {
    return (
        userStore.hasLocalizedPermission(
            "shantytown_comment.moderate",
            townsStore.hash[townId.value]
        ) || userStore.user.id === commentOwnerId
    );
}
</script>
