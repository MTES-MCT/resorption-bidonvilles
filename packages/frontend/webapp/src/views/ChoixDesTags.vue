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
                            Cette sélection peut être modifiée à tout moment
                            depuis la page "Mon profil".
                        </p>
                    </div>
                    <CheckableGroup
                        label="Sélectionnez vos sujets de compétences :"
                        id="expertise_topics"
                        class="mt-4"
                    >
                        <CheckboxUi
                            v-for="tag in configStore.config.expertise_topics"
                            v-model="selectedExpertise[tag.uid]"
                            :key="tag.uid"
                            :label="tag.label"
                        />
                    </CheckableGroup>
                    <CheckableGroup
                        label="Au delà de vos compétences, quels domaines vous intéressent ?"
                        id="interests_topics"
                        class="mt-4"
                    >
                        <CheckboxUi
                            v-for="tag in configStore.config.expertise_topics"
                            v-model="selectedInterests[tag.uid]"
                            :key="tag.uid"
                            :label="tag.label"
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
    overflow: auto;
}
</style>

<script setup>
import { ref } from "vue";
import { setExpertiseTopics } from "@/api/users.api";
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
const selectedExpertise = ref({});
const selectedInterests = ref({});

async function validate() {
    if (pending.value === true) {
        return;
    }

    pending.value = true;
    error.value = null;
    errorSummary.value = {};

    try {
        const userStore = useUserStore();

        const updatedUser = await setExpertiseTopics(
            userStore.id,
            Object.keys(selectedExpertise.value).filter((tag) => {
                return selectedExpertise.value[tag] === true;
            }),
            Object.keys(selectedInterests.value).filter((tag) => {
                return selectedInterests.value[tag] === true;
            })
        );
        configStore.config.user.expertise_topics_chosen = true;
        configStore.config.user.expertise_topics = updatedUser.expertise_topics;

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
