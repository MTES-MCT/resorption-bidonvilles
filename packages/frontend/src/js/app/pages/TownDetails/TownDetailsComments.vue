<template>
    <div>
        <div class="text-display-md pb-2">
            {{ comments.length }} message{{ comments.length > 1 ? "s" : "" }}
        </div>
        <CommentBlock
            v-for="comment in sortedComments"
            :key="comment.id"
            :id="`message${comment.id}`"
            :comment="comment"
        />
    </div>
</template>

<script>
import CommentBlock from "./ui/CommentBlock";

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
