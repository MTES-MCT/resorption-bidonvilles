<template>
    <div id="journal_de_l_action" class="bg-green100 py-10">
        <FicheJournalLayout>
            <template v-slot:body>
                <h1 class="text-3xl text-tertiaryA11Y mb-8">
                    <Icon icon="comment" /> Journal de l'action
                    <span
                        >- {{ action.comments.length }} message{{
                            action.comments.length > 1 ? "s" : ""
                        }}</span
                    >
                </h1>
            </template>
        </FicheJournalLayout>

        <FicheJournalLayout
            v-if="
                userStore.hasActionPermission('action_comment.create', action)
            "
        >
            <template v-slot:aside>
                <FicheActionJournalAside />
            </template>
            <template v-slot:body>
                <FicheActionJournalFormNouveauMessage
                    :action="action"
                    class="mb-12"
                />
            </template>
        </FicheJournalLayout>

        <FicheJournalLayout>
            <template v-slot:body>
                <h1 class="text-lg font-bold mb-2">
                    {{ action.comments.length }} message{{
                        action.comments.length > 1 ? "s" : ""
                    }}
                </h1>
                <FicheActionJournalListeDesMessages
                    :actionId="action.id"
                    :comments="action.comments"
                    v-if="action.comments.length > 0"
                />
                <template v-else
                    >Le journal de l'action ne contient aucun message pour le
                    moment.</template
                >
            </template>
        </FicheJournalLayout>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";

import { Icon } from "@resorptionbidonvilles/ui";
import FicheJournalLayout from "@/components/FicheJournalLayout/FicheJournalLayout.vue";
import FicheActionJournalAside from "./FicheActionJournalAside.vue";
import FicheActionJournalFormNouveauMessage from "./FicheActionJournalFormNouveauMessage/FicheActionJournalFormNouveauMessage.vue";
import FicheActionJournalListeDesMessages from "./FicheActionJournalListeDesMessages.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const userStore = useUserStore();
</script>
