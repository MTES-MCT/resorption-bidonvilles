<template>
    <div id="journal_du_site" class="bg-orange200 py-10">
        <FicheSiteJournalLayout>
            <template v-slot:aside>
                <FicheSiteJournalAside :town="town" />
            </template>
            <template v-slot:body>
                <header>
                    <h1 class="text-3xl text-corail">
                        <Icon icon="comment" /> Journal du site
                        <span
                            >— {{ comments.length }} message{{
                                comments.length > 1 ? "s" : ""
                            }}</span
                        >
                    </h1>
                </header>

                <FicheSiteJournalFormNouveauMessage
                    class="mt-6"
                    :town="town"
                    v-if="!town.closedAt"
                />
            </template>
        </FicheSiteJournalLayout>

        <FicheSiteJournalLayout v-if="comments.length > 0">
            <template v-slot:body>
                <FicheSiteJournalListeDesMessages
                    class="mt-12"
                    :comments="comments"
                />
            </template>
        </FicheSiteJournalLayout>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";

import { Icon } from "@resorptionbidonvilles/ui";
import FicheSiteJournalAside from "./FicheSiteJournalAside.vue";
import FicheSiteJournalLayout from "./FicheSiteJournalLayout.vue";
import FicheSiteJournalFormNouveauMessage from "./FicheSiteJournalFormNouveauMessage/FicheSiteJournalFormNouveauMessage.vue";
import FicheSiteJournalListeDesMessages from "./FicheSiteJournalListeDesMessages.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const comments = computed(() => {
    return [...town.value.comments.regular, ...town.value.comments.covid].sort(
        (a, b) => b.createdAt - a.createdAt
    );
});
</script>
