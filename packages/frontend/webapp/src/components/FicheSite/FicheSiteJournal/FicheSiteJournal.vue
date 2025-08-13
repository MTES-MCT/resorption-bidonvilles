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
                <FicheSiteJournalAside
                    :town="town"
                    ref="aside"
                    class="opacity-0 transition-opacity"
                />
            </template>
            <template v-slot:body>
                <FicheSiteJournalFormNouveauMessage
                    ref="messageForm"
                    :town="town"
                    class="mb-12"
                />
            </template>
        </FicheJournalLayout>

        <FicheJournalLayout id="messages_du_site">
            <template v-slot:aside
                ><div
                    class="flex sticky justify-center top-8 py-2 mb-2 bg-orange200"
                    v-if="
                        userStore.hasLocalizedPermission(
                            'shantytown_comment.create',
                            town
                        )
                    "
                >
                    <Button
                        variant="primary"
                        icon="pen"
                        size="sm"
                        iconPosition="left"
                        @click="focusForm"
                    >
                        Ecrire un message
                    </Button>
                </div></template
            >
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
import { defineProps, ref, toRefs, computed, watch } from "vue";
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

const aside = ref(null);
const messageForm = ref(null);
const isFocused = computed(() => messageForm.value?.isFocused);

const comments = computed(() => {
    return [...town.value.comments].sort((a, b) => b.createdAt - a.createdAt);
});

watch(isFocused, () => {
    aside.value.$el.style.opacity = isFocused.value === true ? "1" : "0";
});

function focusForm() {
    router.push("#journal_du_site");
    messageForm.value.focus();
}
</script>
