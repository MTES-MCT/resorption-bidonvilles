<template>
    <BottomSlidingBlock
        ref="comments"
        :openByDefault="openByDefault"
        :defaultScroll="defaultScroll"
        @cancel="onClose"
        @scroll="onScroll"
    >
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
                <template v-if="sortedComments.length > 0">
                    <TownComment
                        class="mb-4"
                        v-for="comment in sortedComments"
                        :key="comment.id"
                        :comment="comment"
                    />
                </template>
                <p class="text-center text-G600" v-else>
                    Le journal du site est vide pour le moment
                    <Button
                        class="mt-6"
                        icon="pencil-alt"
                        iconPosition="left"
                        @click="createNote"
                        >Rédiger un message</Button
                    >
                </p>
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
        },
        openByDefault: {
            type: Boolean,
            required: false,
            default: false
        },
        defaultScroll: {
            type: Number,
            required: false,
            default: 0
        }
    },

    computed: {
        sortedComments() {
            const sortedComments = [
                ...this.town.comments.regular,
                ...this.town.comments.covid
            ];
            return sortedComments.sort((a, b) => {
                return b.createdAt - a.createdAt;
            });
        }
    },

    methods: {
        show() {
            this.$store.commit("SET_COMMENTS_ARE_OPEN", true);
            this.$refs.comments.show();
        },
        async createNote() {
            const { id } = await this.$store.dispatch(
                "notes/create",
                this.town.id
            );
            this.$router.push(`/notes/${id}`);
            this.$store.dispatch("notes/setupFilterBarAfterCreation");
        },
        onClose() {
            this.$store.commit("SET_COMMENTS_ARE_OPEN", false);
        },
        onScroll(scroll) {
            this.$store.commit("SET_COMMENTS_SCROLL", scroll);
        }
    }
};
</script>
