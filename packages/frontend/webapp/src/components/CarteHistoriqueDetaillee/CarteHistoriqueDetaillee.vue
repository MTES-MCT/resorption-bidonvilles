<template>
    <div
        class="flex"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <ModaleModerationCommentaire
            v-if="activity.comment && !activity.actionEntity"
            ref="moderationModal"
            :comment="activity.comment"
        />
        <CarteHistoriqueIcone
            :color="colors.bg"
            :activity="activity"
            class="mr-4 flex-shrink-0"
        />

        <div class="flex-1">
            <header>
                <h1 :class="`${colors.text} font-bold mt-2`">
                    {{ title }}
                </h1>

                <p v-if="activity.author">
                    par :
                    <LinkOrganization
                        :to="`/structure/${activity.author.organization}`"
                        >{{ activity.author.name }}</LinkOrganization
                    >
                </p>

                <p v-if="activity.shantytown">
                    site :
                    <Link :to="`/site/${activity.shantytown.id}`"
                        >{{ activity.shantytown.usename }},
                        {{ activity.shantytown.city.name }}
                        <span v-if="showDepartementCode"
                            >({{ activity.shantytown.departement.code }})</span
                        ></Link
                    >
                </p>

                <p v-if="activity.user">
                    <LinkOrganization
                        :to="`/structure/${activity.user.organization}`"
                        >{{ activity.user.name }}</LinkOrganization
                    >
                </p>

                <p v-if="activity.actionEntity">
                    action :
                    <Link :to="`/action/${activity.actionEntity.id}`">{{
                        activity.actionEntity.name
                    }}</Link>
                </p>
            </header>

            <CarteHistoriqueCommentaire
                class="mt-4"
                :activity="activity"
                v-if="
                    `${activity.action}-${activity.entity}` ===
                    'creation-comment'
                "
            />
            <CarteHistoriqueSite
                class="mt-4"
                :activity="activity"
                v-if="
                    `${activity.action}-${activity.entity}` ===
                    'update-shantytown'
                "
            />

            <footer class="flex justify-between pt-2">
                <span class="text-G500">{{
                    formatActivityDate(activity.date)
                }}</span>
                <div class="h-10 flex space-x-4 items-center">
                    <Button
                        variant="primaryOutline"
                        icon="fa-regular fa-trash-alt"
                        iconPosition="left"
                        size="sm"
                        v-if="showModerationButton && isHover"
                        @click="openModerationModal"
                    >
                        Supprimer le message
                    </Button>
                    <Link :to="link"
                        ><Icon icon="arrow-right" /> {{ seeMoreWording }}
                    </Link>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import {
    Icon,
    LinkOrganization,
    Link,
    Button,
} from "@resorptionbidonvilles/ui";
import formatActivityDate from "@/utils/formatActivityDate";

import ModaleModerationCommentaire from "@/components/ModaleModerationCommentaire/ModaleModerationCommentaire.vue";
import CarteHistoriqueIcone from "./CarteHistoriqueIcone.vue";
import CarteHistoriqueCommentaire from "./CarteHistoriqueCommentaire.vue";
import CarteHistoriqueSite from "./CarteHistoriqueSite.vue";

const isHover = ref(false);
const moderationModal = ref(null);
const props = defineProps({
    activity: {
        type: Object,
    },
});
const { activity } = toRefs(props);

const showDepartementCode = computed(() => {
    const userStore = useUserStore();
    return userStore.showDepartementCode(
        activity.value.shantytown.departement.code
    );
});

const title = computed(() => {
    switch (`${activity.value.action}-${activity.value.entity}`) {
        case "creation-shantytown":
            return "Nouveau site";

        case "update-shantytown":
            return "Site modifié";

        case "closing-shantytown":
            return "Fermeture d'un site";

        case "creation-user":
            return "Nouvel utilisateur";

        case "creation-comment":
            if (activity.value.comment?.covid) {
                return "Nouveau message Covid-19";
            }

            if (activity.value.actionEntity) {
                return "Nouveau message action";
            }

            return "Nouveau message site";
    }
    return null;
});

const colors = computed(() => {
    if (activity.value.entity === "shantytown") {
        if (activity.value.action === "update") {
            return {
                text: "text-info",
                bg: "bg-info",
            };
        } else if (activity.value.action === "closing") {
            return {
                text: "text-G600",
                bg: "bg-G600",
            };
        }

        // ouverture de site
        return {
            text: "text-black",
            bg: "bg-black",
        };
    }

    if (activity.value.entity === "user") {
        return {
            text: "text-orange500",
            bg: "bg-orange500",
        };
    }

    // création de commentaire
    if (activity.value.comment?.covid) {
        return {
            text: "text-error",
            bg: "bg-error",
        };
    }

    if (activity.value.actionEntity) {
        return {
            text: "text-green600",
            bg: "bg-green500",
        };
    }

    return {
        text: "text-orange600",
        bg: "bg-orange600",
    };
});

const link = computed(() => {
    if (activity.value.entity === "comment") {
        if (activity.value.actionEntity) {
            return `/action/${activity.value.actionEntity.id}#journal_de_l_action`;
        }

        return `/site/${activity.value.shantytown.id}#message${activity.value.comment.id}`;
    }

    if (activity.value.entity === "user") {
        return `/structure/${activity.value.user.organization}`;
    }

    return `/site/${activity.value.shantytown.id}`;
});

const showModerationButton = computed(() => {
    // on vérifie que l'activité en question est modérable (= un commentaire de site)
    if (activity.value.entity !== "comment" || activity.value.actionEntity) {
        return false;
    }

    const userStore = useUserStore();
    const permission = userStore.getPermission("shantytown_comment.moderate");

    // on vérifie que l'utilisateur a le droit de modérer
    if (permission === null || !permission.allowed) {
        return false;
    }

    if (permission.allow_all) {
        return true;
    }

    return (
        permission.allowed_on.regions.includes(
            activity.value.shantytown.region.code
        ) ||
        permission.allowed_on.departements.includes(
            activity.value.shantytown.departement.code
        ) ||
        permission.allowed_on.epci.includes(
            activity.value.shantytown.epci.code
        ) ||
        permission.allowed_on.cities.includes(
            activity.value.shantytown.city.code
        ) ||
        permission.allowed_on.cities.includes(
            activity.value.shantytown.city.main
        ) ||
        permission.allowed_on.shantytowns.includes(activity.value.shantytown.id)
    );
});

const seeMoreWording = computed(() => {
    if (activity.value.entity === "shantytown") {
        return "Voir la fiche du site";
    }

    if (activity.value.entity === "user") {
        return "Voir la fiche dans l'annuaire";
    }

    return "Voir le message";
});

function openModerationModal() {
    moderationModal.value.open();
}
</script>
