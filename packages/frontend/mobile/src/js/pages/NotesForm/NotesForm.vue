<template>
    <Layout>
        <template slot="header">
            <Container class="flex justify-between mb-4">
                <Button
                    icon="paper-plane"
                    iconPosition="left"
                    size="sm"
                    variant="text-primary"
                    class="font-bold"
                    @click="$router.push('/liste-des-notes')"
                    >Publier</Button
                >
                <Button
                    icon="arrow-left"
                    iconPosition="left"
                    size="sm"
                    variant="text-primary"
                    class="font-bold"
                    @click="$router.push('/liste-des-notes')"
                    >Retour aux notes</Button
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
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import Container from "#src/js/components/Container.vue";
import Layout from "#src/js/components/Layout.vue";

export default {
    components: {
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
    }
};
</script>
