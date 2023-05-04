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

    <ModaleListeAccesActionFinancements
        ref="modaleListeAccesActionFinancements"
        :future="false"
        :actionId="action.id"
    />
</template>

<script setup>
import { ref, toRefs, computed, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";

import { useUserStore } from "@/stores/user.store";
import menu from "./FicheAction.menu";

import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
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

const modaleListeAccesActionFinancements = ref(null);

const tabs = computed(() => {
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
            };
        });
});

watch(
    () =>
        bus.value.get(
            "ficheactionfinancements:openListAccesActionFinancements"
        ),
    () => {
        modaleListeAccesActionFinancements.value.open();
    }
);
</script>
