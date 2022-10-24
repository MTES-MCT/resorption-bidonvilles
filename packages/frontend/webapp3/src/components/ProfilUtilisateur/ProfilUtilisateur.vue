<template>
    <ContentWrapper>
        <ViewHeader icon="user">
            <template v-slot:title>
                <slot name="title" />
            </template>
            <template v-slot:description>
                <slot name="description" />
            </template>
        </ViewHeader>

        <InactiveUserWarning v-if="user.status === 'inactive'" class="mt-5" />

        <ArrangementLeftMenu class="mt-10" :tabs="tabs" maxWClass="max-w-2xl">
            <component :is="currentTabComponent" :user="user" />
        </ArrangementLeftMenu>
    </ContentWrapper>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import router from "@/helpers/router";
import tabsDefinition from "./ProfilUtilisateur.tabs.js";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import { useUserStore } from "@/stores/user.store";
import InactiveUserWarning from "@/components/InactiveUserWarning/InactiveUserWarning.vue";

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
