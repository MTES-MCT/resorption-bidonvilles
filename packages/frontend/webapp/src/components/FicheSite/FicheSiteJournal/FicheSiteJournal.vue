<template>
    <div id="journal_du_site" class="bg-orange200 py-10">
        <FicheJournalLayout>
            <template v-slot:body>
                <h2 class="text-3xl text-secondary mb-8">
                    <Icon icon="comment" /> Journal du site
                    <span
                        >- {{ comments.length }} message{{
                            comments.length > 1 ? "s" : ""
                        }}</span
                    >
                </h2>
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
                <FicheSiteJournalAside :town="town" />
            </template>
            <template v-slot:body>
                <FicheSiteJournalFormNouveauMessage
                    :town="town"
                    class="mb-12"
                />
            </template>
        </FicheJournalLayout>

        <FicheJournalLayout id="messages_du_site">
            <template v-slot:body>
                <h3 class="text-lg font-bold mr-4">
                    {{ comments.length }} message{{
                        comments.length > 1 ? "s" : ""
                    }}
                </h3>
                <FicheSiteJournalListeDesMessages
                    :comments="comments"
                    :townId="town.id"
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
import { toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";

import { Icon } from "@resorptionbidonvilles/ui";
import FicheJournalLayout from "@/components/FicheJournalLayout/FicheJournalLayout.vue";
import FicheSiteJournalAside from "./FicheSiteJournalAside.vue";
import FicheSiteJournalFormNouveauMessage from "./FicheSiteJournalFormNouveauMessage/FicheSiteJournalFormNouveauMessage.vue";
import FicheSiteJournalListeDesMessages from "./FicheSiteJournalListeDesMessages.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();

const comments = computed(() => {
    return [...town.value.comments].sort((a, b) => b.createdAt - a.createdAt);
});
</script>
