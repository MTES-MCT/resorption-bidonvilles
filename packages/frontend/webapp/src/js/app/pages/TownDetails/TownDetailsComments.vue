<template>
    <div>
        <div class="text-display-md font-bold pb-2">
            {{ comments.length }} message{{ comments.length > 1 ? "s" : "" }}
        </div>
        <ModerableCommentBlock
            v-for="comment in sortedComments"
            :key="comment.id"
            :id="`message${comment.id}`"
            :comment="comment"
        />
    </div>
</template>

<script>
import ModerableCommentBlock from "#app/components/CommentBlock/ModerableCommentBlock.vue";

export default {
    components: {
        ModerableCommentBlock
    },
    props: {
        comments: {
            type: Array
        }
    },
    computed: {
        sortedComments() {
            const sortedComments = [...this.comments];
            return sortedComments.sort((a, b) => {
                return b.createdAt - a.createdAt;
            });
        }
    }
};
</script>
