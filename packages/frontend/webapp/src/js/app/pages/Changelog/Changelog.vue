<template>
    <PrivateLayout>
        <PrivateContainer>
            <Modal :isOpen="true" :allowClose="false">
                <template v-slot:header>
                    <div class="pt-10 px-10 pb-4">
                        <div class="border-b-1 border-G400 pb-2">
                            <div class="text-display-md font-bold text-primary">
                                Des nouveautés sont disponibles sur la
                                plateforme
                            </div>
                        </div>
                    </div>
                </template>

                <template v-slot:body>
                    <div class="modalWrapper">
                        <div class="text-secondary">
                            {{ currentItem.date }}
                        </div>
                        <h1 class="text-xl font-bold">
                            {{ currentItem.title }}
                        </h1>
                        <div
                            class="changelogModalDescription"
                            v-html="currentItem.description"
                        ></div>
                        <div class="text-center mt-6">
                            <img
                                class="inline-block"
                                :src="currentItem.image"
                                :alt="currentItem.title"
                            />
                        </div>
                        <div
                            v-if="error !== null"
                            class="bg-red300 text-error bold p-3 mt-4"
                        >
                            {{ error }}
                        </div>
                    </div>
                    <div class="flex justify-between mt-8">
                        <div>
                            <Button
                                variant="primary"
                                @click="previousItem"
                                :disabled="pending"
                                v-if="currentItemIndex > 0"
                                >Précédent</Button
                            >
                        </div>
                        <div>
                            <Button
                                variant="primary"
                                @click="nextItem"
                                v-if="currentItemIndex < changelog.length - 1"
                                >Suivant</Button
                            >
                            <Button
                                variant="primary"
                                @click="markChangelogAsRead"
                                :loading="pending"
                                v-else
                                >Accéder à la plateforme</Button
                            >
                        </div>
                    </div>
                </template>
            </Modal>
        </PrivateContainer>
    </PrivateLayout>
</template>

<style>
.changelogModalDescription > p {
    margin-top: 1em;
}
</style>
<style scoped>
.modalWrapper {
    min-height: 50vh;
    max-height: 60vh;
    @apply max-w-2xl;
    overflow: hidden;
}
</style>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";

import { closeChangelog } from "#helpers/api/config";

export default {
    data() {
        const { changelog } = this.$store.state.config.configuration;

        return {
            pending: false,
            error: null,
            changelog,
            currentItemIndex: 0
        };
    },
    computed: {
        currentItem() {
            return this.changelog[this.currentItemIndex];
        }
    },
    components: {
        PrivateLayout,
        PrivateContainer
    },
    methods: {
        previousItem() {
            if (this.currentItemIndex === 0) {
                return;
            }

            this.currentItemIndex -= 1;
        },
        nextItem() {
            if (this.currentItemIndex === this.changelog.length - 1) {
                return;
            }

            this.currentItemIndex += 1;
        },
        markChangelogAsRead() {
            if (this.pending === true) {
                return;
            }

            this.pending = true;
            this.error = null;

            closeChangelog(this.changelog.slice(-1)[0].app_version)
                .then(() => {
                    this.$store
                        .dispatch("config/load")
                        .then(() => {
                            this.pending = false;
                            this.$router.push("/").catch(() => {});
                        })
                        .catch(error => {
                            this.pending = false;
                            this.error =
                                (error && error.user_message) ||
                                "Une erreur inconnue est survenue";
                        });
                })
                .catch(error => {
                    this.pending = false;
                    this.error =
                        (error && error.user_message) ||
                        "Une erreur inconnue est survenue";
                });
        }
    }
};
</script>
