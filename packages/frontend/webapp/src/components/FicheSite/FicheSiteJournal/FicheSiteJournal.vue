<template>
    <div id="journal_du_site" class="bg-orange200 py-10">
        <FicheJournalLayout>
            <template v-slot:body>
                <h1 class="text-3xl text-corail mb-8">
                    <Icon icon="comment" /> Journal du site
                    <span
                        >— {{ comments.length }} message{{
                            comments.length > 1 ? "s" : ""
                        }}</span
                    >
                </h1>
            </template>
        </FicheJournalLayout>

        <FicheJournalLayout
            v-if="
                userStore.hasLocalizedPermission(
                    'shantytown_comment.create',
                    town
                )
            "
        >
            <template v-slot:aside>
                <FicheSiteJournalAside
                    :showFullForm="showFullForm"
                    :town="town"
                />
            </template>
            <template v-slot:body>
                <FicheSiteJournalFormNouveauMessage
                    :town="town"
                    :showFullForm="showFullForm"
                    @show="
                        (value) => {
                            showFullForm = value;
                        }
                    "
                    class="mb-12"
                />
            </template>
        </FicheJournalLayout>

        <FicheJournalLayout>
            <template v-slot:body>
                <div class="flex sticky top-0 py-2 mb-2 bg-orange200">
                    <h1 class="text-lg font-bold mr-4">
                        {{ comments.length }} message{{
                            comments.length > 1 ? "s" : ""
                        }}
                    </h1>
                    <Button
                        v-if="!showFullForm"
                        variant="primary"
                        :class="`border rounded-lg`"
                        icon="pen"
                        size="sm"
                        iconPosition="left"
                        @click="writeMessage"
                    >
                        Ecrire un message
                    </Button>
                </div>
                <FicheSiteJournalListeDesMessages
                    :comments="comments"
                    v-if="comments.length > 0"
                />
                <template v-else
                    >Le journal du site ne contient aucun message pour le
                    moment.</template
                >
            </template>
        </FicheJournalLayout>
    </div>
</template>

<script setup>
import { defineProps, ref, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import router from "@/helpers/router";

import { Icon, Button } from "@resorptionbidonvilles/ui";
import FicheJournalLayout from "@/components/FicheJournalLayout/FicheJournalLayout.vue";
import FicheSiteJournalAside from "./FicheSiteJournalAside.vue";
import FicheSiteJournalFormNouveauMessage from "./FicheSiteJournalFormNouveauMessage/FicheSiteJournalFormNouveauMessage.vue";
import FicheSiteJournalListeDesMessages from "./FicheSiteJournalListeDesMessages.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();

const showFullForm = ref(false);

const comments = computed(() => {
    return [...town.value.comments.regular, ...town.value.comments.covid].sort(
        (a, b) => b.createdAt - a.createdAt
    );
});

function writeMessage() {
    router.push("#journal_du_site");
    showFullForm.value = true;
}
</script>
