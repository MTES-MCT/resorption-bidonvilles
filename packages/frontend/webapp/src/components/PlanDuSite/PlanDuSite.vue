<template>
    <h1 class="text-3xl lg:text-5xl font-bold mb-4 lg:mb-16">Plan du site</h1>
    <div class="ml-5">
        <ContentWrapper>
            <ul class="list-disc">
                <li v-for="lien in liensAutorises" :key="lien.to" class="mb-2">
                    <Link
                        :to="lien.to"
                        class="mr-1"
                        color="text-black"
                        hoverColor="text-black"
                        >{{ lien.linkLabel }}</Link
                    >
                </li>
            </ul>
        </ContentWrapper>
    </div>
</template>
<script setup>
import { computed } from "vue";
import { Link } from "@resorptionbidonvilles/ui";
import { useUserStore } from "@/stores/user.store";

const userStore = useUserStore();

const liens = [
    { to: "/", linkLabel: "Accueil", entity: "none", feature: "none" },
    {
        to: "/connexion",
        linkLabel: "S'identifier sur la plateforme",
        entity: "none",
        feature: "none",
    },
    {
        to: "/deconnexion",
        linkLabel: "Se déconnecter",
        entity: "none",
        feature: "none",
    },
    {
        to: "/mon-compte",
        linkLabel: "Consulter ou modifier les informations liées à mon compte",
        entity: "none",
        feature: "none",
    },
    {
        to: "https://www.blog-resorption-bidonvilles.fr/",
        linkLabel: "Accéder au blog",
        entity: "none",
        feature: "none",
    },
    {
        to: "https://www.blog-resorption-bidonvilles.fr/accueil/categories/ressources",
        linkLabel: "Accéder aux ressources",
        entity: "none",
        feature: "none",
    },

    {
        to: "/tableau-de-bord",
        linkLabel: "Consulter le tableau de bord",
        entity: "none",
        feature: "none",
    },
    {
        to: "/liste-des-sites",
        linkLabel: "Afficher la liste des sites",
        entity: "shantytown",
        feature: "list",
    },
    {
        to: "/site/nouveau",
        linkLabel: "Déclarer un site",
        entity: "shantytown",
        feature: "create",
    },
    {
        to: "/site/signalement",
        linkLabel: "Signaler un site",
        entity: "none",
        feature: "none",
    },
    {
        to: "/liste-des-actions",
        linkLabel: "Afficher la liste des actions",
        entity: "action",
        feature: "list",
    },
    {
        to: "/action/nouveau",
        linkLabel: "Créer une fiche action",
        entity: "action",
        feature: "create",
    },
    {
        to: "/communaute",
        linkLabel: "Demander de l'aide à la communauté",
        entity: "none",
        feature: "none",
    },
    {
        to: "/communaute/nouvelle-question",
        linkLabel: "Poser une question à la communauté",
        entity: "none",
        feature: "none",
    },
    {
        to: "/annuaire",
        linkLabel: "Consulter l'annuaire",
        entity: "none",
        feature: "none",
    },
    {
        to: "/cartographie",
        linkLabel: "Visualiser la carte des bidonvilles",
        entity: "none",
        feature: "none",
    },
    {
        to: "/activites",
        linkLabel: "Visualiser l'historique des activités",
        entity: "none",
        feature: "none",
    },

    {
        to: "/visualisation-donnees",
        linkLabel: "Visualiser les données",
        entity: "none",
        feature: "none",
    },
    {
        to: "/acces",
        linkLabel: "Consulter la liste des comptes",
        entity: "user",
        feature: "list",
    },
    {
        to: "/nouvel-utilisateur",
        linkLabel: "Ajouter un nouvel utilisateur",
        entity: "user",
        feature: "create",
    },
    {
        to: "/invitation",
        linkLabel: "Inviter vos contacts sur la plateforme",
        entity: "none",
        feature: "none",
    },
    {
        to: "https://resorption-bidonvilles.localhost/stats",
        linkLabel: "Visualiser les statistiques du site",
        entity: "none",
        feature: "none",
    },
    {
        to: "https://resorption-bidonvilles.localhost/mentions-legales",
        linkLabel: "Visualiser les mentions légales",
        entity: "none",
        feature: "none",
    },
    {
        to: "https://resorption-bidonvilles.localhost/conditions-d-utilisation.pdf",
        linkLabel: "Visualiser les conditions générales d'utilisation",
        entity: "none",
        feature: "none",
    },
];

const userPermissions = computed(() => {
    return userStore.user.permissions;
});

const shantytownCreateAllowed =
    userPermissions.value["shantytown"]["create"].allowed;

const liensAutorises = computed(() => {
    return liens
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
