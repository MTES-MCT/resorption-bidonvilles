<template>
    <DsfrHeader
        :logoText="headerDatas.logoText"
        :homeTo="headerDatas.homeTo"
        :homeLabel="headerDatas.homeLabel"
        :operatorImgSrc="headerDatas.operatorImgSrc"
        :operatorImgAlt="headerDatas.operatorImgAlt"
        :operatorImgStyle="headerDatas.operatorImgStyle"
        :quickLinks="quickLinks"
    >
        <template #mainnav>
            <DsfrNavigation :nav-items="headerDatas.navItems" />
        </template>
    </DsfrHeader>
</template>

<script setup>
import { computed, ref } from "vue";
import logoDihal from "@/assets/img/logo/dihal.png";
import { useConfigStore } from "@/stores/config.store.js";
import { useNavigationStore } from "@/stores/navigation.store.js";
const navigationStore = useNavigationStore();
const configStore = useConfigStore();

const quickLinks = computed(() => {
    return navigationStore.topItems.map((item) => {
        if (item.label !== "Blog") {
            return item;
        }

        if (!configStore.config?.blog?.isBadgeActive) {
            return item;
        }

        return {
            ...item,
            class: [item.class, "navbar__quicklink--blog-badge"]
                .filter(Boolean)
                .join(" "),
            title: "Nouvel article",
        };
    });
});

// Paramétrage du header DSFR
const headerDatas = ref({
    homeTo: "/",
    homeLabel: "Plateforme Résorption des bidonvilles",
    logoText: "Gouvernement",
    operatorImgSrc: logoDihal,
    operatorImgAlt:
        "Délégation interministérielle à l'hébergement et à l'accès au logement",
    operatorImgStyle: "height: auto; max-height: 3rem;",
    navItems: navigationStore.mainItems,
});
</script>
<style scoped>
/* Style spécifique pour le badge de notification du lien "Blog" */
:deep(.navbar__quicklink--blog-badge) {
    position: relative;
    padding-left: 1rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='7.5' fill='%23fe1744'/%3E%3Ctext x='8' y='10.9' text-anchor='middle' font-family='Marianne, Arial, sans-serif' font-size='9.6' font-weight='700' fill='%23ffffff'%3E1%3C/text%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: 0.8rem 0.8rem;
    background-position: left 0.2rem top 0rem;
}
</style>
