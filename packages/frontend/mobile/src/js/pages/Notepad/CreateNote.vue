<template>
    <Layout>
        <Container class="h-full flex flex-col justify-center">
            <header class="pt-4">
                <RbLogo class="mx-auto" />
            </header>
            <div class="flex-1">
                <div class="text-display-md font-bold pt-4 pb-4 flex-1">
                    Bloc-notes
                </div>
                <div class="bg-blue100 p-6 customShadow">
                    <div class="mb-4">
                        <Icon icon="user" /> {{ user.first_name }}
                        {{ user.last_name }}
                    </div>

                    <textarea
                        class="flex-auto border-2 border-blue200 w-full mb-4"
                        v-model="note.text"
                        rules="required"
                        rows="8"
                        placeholder="Veuillez saisir votre note ici..."
                    />
                    <div v-if="error" class="bg-red200 p-3 mb-8">
                        {{ error }}
                    </div>
                    <div class="flex items-center justify-between">
                        <p>
                            <Button
                                v-if="note.text.length > 0"
                                variant="primaryText"
                                @click="cancelNote"
                                >Effacer</Button
                            >
                        </p>
                        <Button variant="tertiary" @click="addNote"
                            >Publier</Button
                        >
                    </div>
                </div>
            </div>
        </Container>
    </Layout>
</template>

<script>
import Layout from "#src/js/components/Layout.vue";
import { Button, Icon, RbLogo } from "@resorptionbidonvilles/ui";
import Container from "#src/js/components/Container";

export default {
    components: {
        Layout,
        Button,
        Container,
        Icon,
        RbLogo
    },
    data() {
        return {
            note: {
                publishedAt: null,
                shantytownTarget: null,
                text: ""
            },
            error: null
        };
    },
    methods: {
        cancelNote() {
            this.note.text = "";
        },
        addNote() {
            // TODO
        }
    },
    computed: {
        user() {
            return this.$store.state.config.configuration.user;
        }
    }
};
</script>
