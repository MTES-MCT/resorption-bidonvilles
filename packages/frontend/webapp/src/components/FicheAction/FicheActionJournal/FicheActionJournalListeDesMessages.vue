<template>
    <section>
        <CarteCommentaire
            v-for="comment in enrichedComments"
            :key="comment.id"
            :id="`message${comment.id}`"
            :comment="comment"
            :entityId="actionId"
            entityType="action_comment"
            :disallowAttachmentsRemoval="!comment.isAllowedToDeleteAttachment"
        />
    </section>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";
import { useUserStore } from "@/stores/user.store";

const props = defineProps({
    comments: Array,
    actionId: Number,
});
const { comments, actionId } = toRefs(props);

const enrichedComments = computed(() => {
    return comments.value.map((comment) => {
        return {
            ...comment,
            isAllowedToDeleteAttachment: canUserDeleteActionCommentAttachment(
                comment.createdBy.id
            ),
        };
    });
});

function canUserDeleteActionCommentAttachment(ownerId) {
    // Peut-être ajouter au(x) pilote(s) de l'action le droit de supprimer une pièce jointe
    // Attention: la computed ci-dessus retourne false pour les pilotes
    const userStore = useUserStore();
    return userStore.user.is_superuser || userStore.user.id === ownerId;
}
</script>
