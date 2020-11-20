<template>
    <div>
        <div class="text-display-lg text-corail py-6">
            {{ comments.length }} commentaires
        </div>
        <CommentBlock
            v-for="comment in comments"
            :key="comment.id"
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
    }
};
</script>
