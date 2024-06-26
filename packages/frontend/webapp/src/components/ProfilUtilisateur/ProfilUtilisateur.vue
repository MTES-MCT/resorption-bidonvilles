<template>
    <ContentWrapper>
        <ViewHeader icon="user">
            <template v-slot:title>
                <slot name="title" />
            </template>
            <template v-slot:description>
                <slot name="description" />
            </template>
            <template v-slot:actions>
                <Button
                    icon="file-pdf"
                    iconPosition="left"
                    variant="primaryOutline"
                    size="sm"
                    :href="configStore.config.version_charte_engagement.fichier"
                >
                    Charte d'engagement de l'utilisateur</Button
                >
            </template>
        </ViewHeader>

        <InactiveUserWarning v-if="user.status === 'inactive'" class="mt-5" />
        <RefusedUserAccount v-if="user.status === 'refused'" class="mt-5" />

        <ArrangementLeftMenu
            class="mt-10"
            :tabs="tabs"
            :activeTab="currentTabId"
            :autohide="false"
            maxWClass="max-w-2xl"
        >
            <component :is="currentTabComponent" :user="user" />
        </ArrangementLeftMenu>
    </ContentWrapper>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import router from "@/helpers/router";
import tabsDefinition from "./ProfilUtilisateur.tabs.js";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import { useUserStore } from "@/stores/user.store";
import InactiveUserWarning from "@/components/InactiveUserWarning/InactiveUserWarning.vue";
import RefusedUserAccount from "@/components/RefusedUserAccount/RefusedUserAccount.vue";
import { useConfigStore } from "@/stores/config.store";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    // fonction qui construit la route pour chaque onglet, sur la base de son id
    buildTabRoute: {
        type: Function,
        required: true,
    },
});
const { user, buildTabRoute } = toRefs(props);
const configStore = useConfigStore();

const self = computed(() => {
    const userStore = useUserStore();
    return user.value.id === userStore.user?.id;
});

const tabs = computed(() => {
    return tabsDefinition
        .filter(({ selfOnly }) => selfOnly !== true || self.value === true)
        .map((tab) => {
            tab.active = tab.id === currentTabId.value;
            tab.route = buildTabRoute.value(tab.id);
            return tab;
        });
});

const currentTabId = computed(() => {
    return router.currentRoute.value.params.tab;
});

const currentTabComponent = computed(() => {
    return tabs.value.find(({ active }) => active === true).component;
});
</script>
