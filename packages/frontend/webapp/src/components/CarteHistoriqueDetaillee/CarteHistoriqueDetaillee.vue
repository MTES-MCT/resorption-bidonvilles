<template>
    <div
        class="flex"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
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
            <CarteHistoriqueQuestion
                class="mt-4"
                :activity="activity"
                v-if="
                    `${activity.action}-${activity.entity}` ===
                    'creation-question'
                "
            />
            <CarteHistoriqueReponse
                class="mt-4"
                :activity="activity"
                v-if="
                    `${activity.action}-${activity.entity}` ===
                    'creation-answer'
                "
            />

            <footer class="flex justify-between pt-2">
                <span class="text-G700">{{
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
import { defineProps, toRefs, ref, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useModaleStore } from "@/stores/modale.store";
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
import CarteHistoriqueQuestion from "./CarteHistoriqueQuestion.vue";
import CarteHistoriqueReponse from "./CarteHistoriqueReponse.vue";

const isHover = ref(false);
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
        case "creation-question":
            return "Nouvelle question";
        case "creation-answer":
            return "Nouvelle réponse";
        case "creation-comment":
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
                text: "text-G700",
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

    if (["question", "answer"].includes(activity.value.entity)) {
        return {
            text: "text-primary",
            bg: "bg-primary",
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
    if (activity.value.entity === "question") {
        return `/question/${activity.value.question.id}`;
    }

    if (activity.value.entity === "answer") {
        return `/question/${activity.value.question.id}#reponse${activity.value.answer.id}`;
    }

    return `/site/${activity.value.shantytown.id}`;
});

const showModerationButton = computed(() => {
    // on vérifie que l'activité en question est modérable (= un commentaire de site)
    if (activity.value.entity !== "comment" || activity.value.actionEntity) {
        return false;
    }

    const userStore = useUserStore();
    return userStore.hasLocalizedPermission(
        "data.moderate",
        activity.value.shantytown
    );
});

const seeMoreWording = computed(() => {
    if (activity.value.entity === "shantytown") {
        return "Voir la fiche du site";
    }

    if (activity.value.entity === "user") {
        return "Voir la fiche dans l'annuaire";
    }

    if (activity.value.entity === "question") {
        return "Voir la question";
    }

    if (activity.value.entity === "answer") {
        return "Voir la réponse";
    }

    return "Voir le message";
});

function openModerationModal() {
    const modaleStore = useModaleStore();
    modaleStore.open(ModaleModerationCommentaire, {
        comment: activity.value.comment,
    });
}
</script>
