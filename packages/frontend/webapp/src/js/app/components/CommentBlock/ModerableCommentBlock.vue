<template>
    <div>
        <CommentModerationModal
            ref="modal"
            :comment="comment"
            v-if="showModeration"
            @close="showModeration = false"
        />
        <CommentBlock
            :comment="comment"
            :showActionIcons="true"
            @moderate="show"
        />
    </div>
</template>

<script>
import CommentBlock from "./CommentBlock.vue";
import CommentModerationModal from "./CommentModerationModal.vue";

export default {
    props: {
        comment: {
            type: Object,
            required: true
        }
    },

    components: {
        CommentBlock,
        CommentModerationModal
    },

    data() {
        return {
            showModeration: false
        };
    },

    methods: {
        show() {
            this.showModeration = true;
            this.$nextTick(() => {
                this.$refs.modal.open();
            });
        }
    }
};
</script>
