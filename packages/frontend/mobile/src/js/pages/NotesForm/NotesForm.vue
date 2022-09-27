<template>
    <div>
        <Layout>
            <template slot="header">
                <Container class="flex justify-end mb-4">
                    <Button
                        icon="arrow-left"
                        iconPosition="left"
                        size="sm"
                        variant="textPrimary"
                        class="text-primary"
                        @click="$router.push('/liste-des-notes')"
                        >Retour aux notes</Button
                    >
                    <Button
                        icon="paper-plane"
                        iconPosition="left"
                        size="sm"
                        variant="textPrimary"
                        class="text-primary"
                        @click="showPublish"
                        >Publier</Button
                    >
                </Container>
            </template>
            <template slot="scroll">
                <textarea
                    class="px-6 w-full h-full outline-none"
                    ref="textarea"
                    v-model="description"
                ></textarea>
            </template>
        </Layout>
        <BottomSlidingBlock ref="publishBlock">
            <template slot="header">Publier ma note</template>
            <template slot="body">
                <Container>test</Container>
            </template>
        </BottomSlidingBlock>
    </div>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import BottomSlidingBlock from "#src/js/components/BottomSlidingBlock.vue";
import Container from "#src/js/components/Container.vue";
import Layout from "#src/js/components/Layout.vue";

export default {
    components: {
        BottomSlidingBlock,
        Button,
        Container,
        Layout
    },
    mounted() {
        this.$refs.textarea.focus();
    },
    computed: {
        note() {
            return this.$store.state.notes.notes.find(
                ({ id }) => id === this.$route.params.id
            );
        },
        description: {
            get() {
                return this.note.description;
            },
            async set(text) {
                await this.$store.dispatch("notes/setDescription", {
                    id: this.$route.params.id,
                    description: text
                });
            }
        }
    },
    methods: {
        showPublish() {
            this.$refs.publishBlock.show();
        }
    }
};
</script>
