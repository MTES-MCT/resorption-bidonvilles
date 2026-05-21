<template>
    <DsfrHeader
        :logoText="headerDatas.logoText"
        :homeTo="headerDatas.homeTo"
        :homeLabel="headerDatas.homeLabel"
        :operatorImgSrc="headerDatas.operatorImgSrc"
        :operatorImgStyle="headerDatas.operatorImgStyle"
        :quickLinks="headerDatas.quickLinks"
    >
        <template #mainnav>
            <DsfrNavigation :nav-items="headerDatas.navItems" />
        </template>
    </DsfrHeader>
</template>

<script setup>
import { ref } from "vue";

// components
import logoDihal from "@/assets/img/logo/dihal.png";
import { useNavigationStore } from "@/stores/navigation.store.js";
const navigationStore = useNavigationStore();

// Paramétrage du header DSFR
const headerDatas = ref({
    homeTo: "/",
    homeLabel: "Plateforme Résorption des bidonvilles",
    logoText: "Gouvernement",
    operatorImgSrc: logoDihal,
    operatorImgStyle: "height: auto; max-height: 3rem;",
    quickLinks: navigationStore.topItems,
    navItems: navigationStore.mainItems,
});
</script>
