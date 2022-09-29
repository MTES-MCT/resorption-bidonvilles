<template>
    <BottomSlidingBlock ref="comments">
        <template v-slot:header>Journal du site</template>
        <template v-slot:body>
            <Container>
                <TownComment
                    class="mb-4"
                    v-for="comment in town.comments.regular"
                    :key="comment.id"
                    :comment="comment"
                />
            </Container>
        </template>
    </BottomSlidingBlock>
</template>

<script>
import Container from "#src/js/components/Container.vue";
import BottomSlidingBlock from "#src/js/components/BottomSlidingBlock.vue";
import TownComment from "./TownComment.vue";

export default {
    components: {
        Container,
        BottomSlidingBlock,
        TownComment
    },

    props: {
        town: {
            type: Object,
            required: true
        }
    },

    methods: {
        show() {
            this.$refs.comments.show();
        }
    }
};
</script>
