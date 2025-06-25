<template>
    <FicheActionHeader :action="action" />

    <ContentWrapper>
        <ArrangementLeftMenu columnWidthClass="w-96" :tabs="tabs" autonav>
            <FicheActionCaracteristiques :action="action" class="mb-8" />
            <FicheActionLocalisation :action="action" class="mb-8" />
            <FicheActionContacts :action="action" class="mb-8" />
            <FicheActionFinancements
                v-if="
                    userStore.hasActionPermission(
                        'action_finances.access',
                        action
                    )
                "
                :action="action"
                class="mb-8"
            />
            <FicheActionAbsenceIndicateurs
                v-if="action.metrics.length === 0"
                :action="action"
                class="mb-8"
            />
            <FicheActionIndicateurs v-else :action="action" class="mb-8" />
        </ArrangementLeftMenu>
    </ContentWrapper>

    <FicheActionJournal
        :action="action"
        class="mt-4"
        v-if="userStore.hasActionPermission('action_comment.read', action)"
    />
</template>

<script setup>
import { toRefs, computed, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";

import { useUserStore } from "@/stores/user.store";
import { useModaleStore } from "@/stores/modale.store";
import menu from "./FicheAction.menu";

import { ContentWrapper } from "@resorptionbidonvilles/ui";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import FicheActionHeader from "./FicheActionHeader/FicheActionHeader.vue";
import FicheActionCaracteristiques from "./FicheActionCaracteristiques/FicheActionCaracteristiques.vue";
import FicheActionLocalisation from "./FicheActionLocalisation.vue/FicheActionLocalisation.vue";
import FicheActionContacts from "./FicheActionContacts/FicheActionContacts.vue";
import FicheActionFinancements from "./FicheActionFinancements/FicheActionFinancements.vue";
import FicheActionIndicateurs from "./FicheActionIndicateurs/FicheActionIndicateurs.vue";
import FicheActionAbsenceIndicateurs from "./FicheActionAbsenceIndicateurs/FicheActionAbsenceIndicateurs.vue";
import FicheActionJournal from "./FicheActionJournal/FicheActionJournal.vue";
import ModaleListeAccesActionFinancements from "@/components/ModaleListeAccesActionFinancements/ModaleListeAccesActionFinancements.vue";

const { bus } = useEventBus();

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);

const userStore = useUserStore();

const tabs = computed(() => {
    const commentsAttachments = action.value.comments.reduce((sum, comment) => {
        return sum + (comment.attachments ? comment.attachments.length : 0);
    }, 0);

    return menu
        .filter((item) => {
            if (!item.condition) {
                return item;
            }

            return item.condition(action.value);
        })
        .map((item) => {
            return {
                ...item,
                label: item.label(action.value),
                postIcon:
                    item.id === "journal_de_l_action" &&
                    commentsAttachments > 0,
            };
        });
});

watch(
    () =>
        bus.value.get(
            "ficheactionfinancements:openListAccesActionFinancements"
        ),
    () => {
        const modaleStore = useModaleStore();
        modaleStore.open(ModaleListeAccesActionFinancements, {
            future: false,
            actionId: action.value.id,
        });
    }
);
</script>
