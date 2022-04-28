<template>
    <div>
        <div class="text-display-md font-bold pb-2">
            {{ comments.length }} message{{ comments.length > 1 ? "s" : "" }}
        </div>
        <CommentBlock
            v-for="comment in sortedComments"
            :key="comment.id"
            :id="`message${comment.id}`"
            :comment="comment"
            :showActionIcons="true"
        />
    </div>
</template>

<script>
import CommentBlock from "#app/components/CommentBlock/CommentBlock.vue";

export default {
    components: {
        CommentBlock
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
