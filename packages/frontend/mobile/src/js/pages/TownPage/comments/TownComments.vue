<template>
    <BottomSlidingBlock ref="comments">
        <template v-slot:header-left>
            <span class="text-primary">
                <Button
                    icon="pencil-alt"
                    iconPosition="left"
                    variant="textPrimary"
                    size="md"
                    :padding="false"
                    @click="createNote"
                    >Rédiger</Button
                >
            </span>
        </template>
        <template v-slot:header>
            Journal du site
        </template>
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
import { Button } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Container,
        BottomSlidingBlock,
        TownComment,
        Button
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
        },
        async createNote() {
            const { id } = await this.$store.dispatch(
                "notes/create",
                this.town.id
            );
            this.$router.push(`/notes/${id}`);
            this.$store.dispatch("notes/setupFilterBarAfterCreation");
        }
    }
};
</script>
