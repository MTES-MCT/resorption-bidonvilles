<template>
    <h1 class="text-3xl lg:text-5xl font-bold mb-4 lg:mb-16">Plan du site</h1>
    <ContentWrapper>
        <ul class="list-disc ml-5">
            <li v-for="lien in liensAutorises" :key="lien.to" class="mb-2">
                <Link :to="lien.to" hoverColor="text-black">{{
                    lien.label
                }}</Link>
            </li>
        </ul>
    </ContentWrapper>
</template>
<script setup>
import { computed } from "vue";
import { Link } from "@resorptionbidonvilles/ui";
import { useUserStore } from "@/stores/user.store";
import router from "@/helpers/router.js";
const userStore = useUserStore();

const filteredAndSortedRoutes = router
    .getRoutes()
    .reduce((acc, route) => {
        if (route.meta?.title && route.meta?.displayOrderOnSiteMap !== 0) {
            const { path, meta } = route;
            const { title, displayOrderOnSiteMap, permissions } = meta;
            const permissionsInfo = permissions
                ? {
                      entity: permissions[0].split(".")[0],
                      feature: permissions[0].split(".")[1],
                  }
                : { entity: "none", feature: "none" };
            acc.push({
                to: path,
                label: title,
                displayOrder: displayOrderOnSiteMap || 0, // Utilisation de 0 par défaut si displayOrderOnSiteMap est absent
                ...permissionsInfo,
            });
        }
        return acc;
    }, [])
    .sort((a, b) => a.displayOrder - b.displayOrder);

const userPermissions = computed(() => {
    return userStore.user.permissions;
});

const shantytownCreateAllowed =
    userPermissions.value["shantytown"]["create"].allowed;

const liensAutorises = computed(() => {
    return filteredAndSortedRoutes
        .map((lien) => {
            const entity = lien.entity;
            const feature = lien.feature;
            const to = lien.to;

            if (to === "/site/nouveau") {
                return shantytownCreateAllowed ? { ...lien } : null;
            } else if (to === "/site/signalement") {
                return shantytownCreateAllowed ? null : { ...lien };
            } else {
                if (entity === "none" && feature === "none") {
                    return {
                        ...lien, // Inclure les objets avec entity et feature égaux à 'none'
                    };
                }

                if (
                    userPermissions.value[entity] &&
                    userPermissions.value[entity][feature] &&
                    userPermissions.value[entity][feature].allowed === true
                ) {
                    return {
                        ...lien, // Inclure l'objet d'origine
                    };
                }

                return null; // Ne pas inclure cet objet
            }
        })
        .filter(Boolean);
});
</script>
