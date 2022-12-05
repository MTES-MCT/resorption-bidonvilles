<template>
    <Layout>
        <Modal :isOpen="true" :allowClose="false" v-if="currentItem">
            <template v-slot:header>
                <div class="pt-10 px-10 pb-4">
                    <div class="border-b-1 border-G400 pb-2">
                        <div class="text-display-md font-bold text-primary">
                            Des nouveautés sont disponibles sur la plateforme
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
    </Layout>
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

<script setup>
import { ref, computed, onMounted } from "vue";
import { closeChangelog } from "@/api/config.api";
import { useConfigStore } from "@/stores/config.store";

import Layout from "@/components/Layout/Layout.vue";
import { Button, Modal } from "@resorptionbidonvilles/ui";
import router from "@/helpers/router";

const configStore = useConfigStore();
const { changelog } = configStore.config;

// data
const pending = ref(false);
const error = ref(null);
const currentItemIndex = ref(0);

const currentItem = computed(() => {
    return changelog[currentItemIndex.value];
});

onMounted(() => {
    if (changelog.length === 0) {
        router.replace("/");
    }
});

function previousItem() {
    if (currentItemIndex.value === 0) {
        return;
    }

    currentItemIndex.value -= 1;
}

function nextItem() {
    if (currentItemIndex.value === changelog.length - 1) {
        return;
    }

    currentItemIndex.value += 1;
}

async function markChangelogAsRead() {
    if (pending.value === true) {
        return;
    }

    pending.value = true;
    error.value = null;

    try {
        await closeChangelog(changelog.slice(-1)[0].app_version);
        configStore.config.changelog = [];
        router.replace("/");
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }

    pending.value = false;
}
</script>
