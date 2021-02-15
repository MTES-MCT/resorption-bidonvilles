<template>
    <PrivateLayout>
        <PrivateContainer>
            <Modal :isOpen="true" :allowClose="false">
                <template v-slot:header>
                    <div class="pt-10 px-10 pb-4">
                        <div class="border-b border-G400 pb-2">
                            <div class="text-display-md text-primary">
                                Des nouveautés sont disponibles sur la
                                plateforme
                            </div>
                            <div class="text-secondary">
                                {{ changelog.date }}
                            </div>
                        </div>
                    </div>
                </template>

                <template v-slot:body>
                    <div class="flex justify-between">
                        <div class="w-128 mr-8">
                            <img
                                :src="currentItem.image"
                                :alt="currentItem.title"
                            />
                            <div class="text-center">
                                <span
                                    v-for="(item, index) in changelog.items"
                                    v-bind:key="index"
                                    class="inline-block bg-gray-500 w-2 h-2 mx-1 rounded"
                                    v-bind:class="{
                                        'bg-primary': index === currentItemIndex
                                    }"
                                ></span>
                            </div>
                        </div>
                        <div class="w-128 pt-2">
                            <header class="text-gray-500 bold">
                                <p>
                                    <span class="text-primary">{{
                                        currentItemIndex + 1
                                    }}</span>
                                    / {{ changelog.items.length }}
                                </p>
                                <h1 class="text-primary bold">
                                    {{ currentItem.title }}
                                </h1>
                            </header>
                            <div
                                class="description"
                                v-html="currentItem.description"
                            ></div>
                        </div>
                    </div>
                    <div
                        v-if="error !== null"
                        class="bg-red300 text-error bold p-3 mt-4"
                    >
                        {{ error }}
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
                                v-if="
                                    currentItemIndex <
                                        changelog.items.length - 1
                                "
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
.description p {
    margin-top: 1rem;
}
</style>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";

import { closeChangelog, get as getConfig, load } from "#helpers/api/config";

export default {
    data() {
        const { changelog } = getConfig();

        return {
            pending: false,
            error: null,
            changelog,
            currentItemIndex: 0
        };
    },
    computed: {
        currentItem() {
            return this.changelog.items[this.currentItemIndex];
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
            if (this.currentItemIndex === this.changelog.items.length - 1) {
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

            closeChangelog(this.changelog.app_version)
                .then(() => {
                    load()
                        .then(() => {
                            this.pending = false;
                            this.$router.push("/");
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
