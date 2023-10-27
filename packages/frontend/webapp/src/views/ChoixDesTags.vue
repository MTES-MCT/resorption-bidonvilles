<template>
    <Layout>
        <Modal :isOpen="true" :allowClose="false">
            <template v-slot:header>
                <div class="pt-10 px-10 pb-4">
                    <div class="border-b-1 border-G400 pb-2">
                        <div class="text-display-md font-bold text-primary">
                            Nouveau !
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:body>
                <div class="modalWrapper">
                    <div class="text-secondary">
                        Une plateforme qui s'adapte à vos besoins
                    </div>
                    <h1 class="text-xl font-bold">
                        Quels sont vos sujets d'intérêt ou d'expertise ?
                    </h1>
                    <div>
                        <p class="mt-2">
                            En sélectionnant vos sujets d'intérêts ci-dessous,
                            la plateforme évoluera afin de vous offrir une
                            interface, des outils, et du contenu plus
                            personnalisés et donc adaptés à vos besoins.
                        </p>
                        <p class="mt-2">
                            Cette sélection est parfaitement
                            <span class="font-bold">optionnelle</span>, peut
                            être modifiée à tout moment depuis votre page "Mon
                            profil", et n'a pour but que d'améliorer votre
                            expérience sur la plateforme.
                        </p>
                    </div>
                    <CheckableGroup
                        label="Sujets disponibles"
                        id="tags"
                        class="mt-4"
                    >
                        <CheckboxUi
                            v-for="tag in configStore.config.question_tags"
                            v-model="selectedTags[tag.uid]"
                            :key="tag.uid"
                            :label="tag.name"
                        />
                    </CheckableGroup>
                    <ErrorSummary
                        v-if="error !== null"
                        :message="error"
                        :summary="errorSummary"
                    />
                </div>
                <div class="flex justify-end mt-4">
                    <Button
                        variant="primary"
                        @click="validate"
                        :loading="pending"
                        >Valider ma sélection</Button
                    >
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<style scoped>
.modalWrapper {
    min-height: 50vh;
    max-height: 60vh;
    @apply max-w-2xl;
    overflow: hidden;
}
</style>

<script setup>
import { ref } from "vue";
import { selectTags } from "@/api/users.api";
import { useConfigStore } from "@/stores/config.store";
import { useUserStore } from "@/stores/user.store";

import Layout from "@/components/Layout/Layout.vue";
import {
    Button,
    CheckableGroup,
    CheckboxUi,
    ErrorSummary,
    Modal,
} from "@resorptionbidonvilles/ui";
import router from "@/helpers/router";

const configStore = useConfigStore();

// data
const pending = ref(false);
const error = ref(null);
const errorSummary = ref(null);
const selectedTags = ref({});

async function validate() {
    if (pending.value === true) {
        return;
    }

    pending.value = true;
    error.value = null;
    errorSummary.value = {};

    try {
        const userStore = useUserStore();

        const updatedUser = await selectTags(
            userStore.id,
            Object.keys(selectedTags.value).filter((tag) => {
                return selectedTags.value[tag] === true;
            })
        );
        configStore.config.user.tags_chosen = true;
        configStore.config.user.tags = updatedUser.tags;

        router.replace("/");
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields && Object.keys(e.fields).length > 0) {
            errorSummary.value = Object.keys(e.fields).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: e.fields[key][0],
                }),
                {}
            );
        }
    }

    pending.value = false;
}
</script>
