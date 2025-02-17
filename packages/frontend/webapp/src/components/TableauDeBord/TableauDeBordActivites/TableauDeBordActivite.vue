<template>
    <article
        :class="`flex py-4 ${
            !activity.shantytown ? 'items-center' : ''
        } hover:bg-G200 cursor-pointer`"
        @click="routeToDetails"
    >
        <aside class="mr-6 self-start">
            <span
                :class="`${iconColor.background} ${iconColor.text} text-xl rounded-full inline-flex items-center justify-center w-12 h-12`"
            >
                <Icon :icon="icon" />
            </span>
        </aside>

        <section>
            <p class="font-bold text-primary">
                {{ title
                }}<span v-if="subtitle" class="ml-1 font-normal text-G700">{{
                    subtitle
                }}</span>
            </p>
            <h4 class="mt-1" v-if="activity.shantytown">
                <span class="font-bold">{{ activity.shantytown.usename }}</span>
                <span class="ml-1 italic"
                    >{{ activity.shantytown.city.name }}
                    <span v-if="showDepartementCode"
                        >({{ activity.shantytown.departement.code }})</span
                    >
                </span>
            </h4>
            <p class="mt-1" v-if="activity.actionEntity">
                <span class="font-bold">{{ activity.actionEntity.name }}</span>
            </p>
            <TagObjectifResorption
                v-if="resorptionTarget"
                :target="resorptionTarget"
            />
            <p class="text-G700">{{ formatActivityDate(activity.date) }}</p>
            <!-- eslint-disable prettier/prettier -->
            <blockquote v-if="description" class="mt-3 border-l-4 border-primary py-1 pl-2 italic whitespace-pre-line">
                “{{ description }}“</blockquote>
            <!-- eslint-enable prettier/prettier -->
        </section>
    </article>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import formatActivityDate from "@/utils/formatActivityDate";
import { useUserStore } from "@/stores/user.store";
import { trackEvent } from "@/helpers/matomo";
import router from "@/helpers/router";

import { Icon } from "@resorptionbidonvilles/ui";
import TagObjectifResorption from "@/components/TagObjectifResorption/TagObjectifResorption.vue";

const props = defineProps({
    activity: {
        type: Object,
        required: true,
    },
});
const { activity } = toRefs(props);

const colors = {
    green: {
        background: "bg-green100",
        text: "text-green500",
    },
    blue: {
        background: "bg-blue100",
        text: "text-blue500",
    },
    orange: {
        background: "bg-orange100",
        text: "text-orange500",
    },
    red: {
        background: "bg-error",
        text: "text-white",
    },
    gray: {
        background: "bg-G300",
        text: "text-G800",
    },
};
const showDepartementCode = computed(() => {
    const userStore = useUserStore();
    return userStore.showDepartementCode(
        activity.value.shantytown?.departement.code
    );
});
const event = computed(() => {
    return `${activity.value.entity}-${activity.value.action}`;
});
const title = computed(() => {
    switch (event.value) {
        case "user-creation": {
            const { users } = activity.value;
            const names = users.map(
                ({
                    name,
                    organizationAbbreviation,
                    organizationName,
                    intervention_areas,
                }) => {
                    name += ` - ${
                        organizationAbbreviation || organizationName
                    }`;
                    if (!showDepartementCode.value) {
                        return name;
                    }

                    if (intervention_areas.is_national === true) {
                        return name;
                    }

                    const areaNames = intervention_areas.areas
                        .filter((area) => area.is_main_area)
                        .map((area) => {
                            if (area.type === "departement") {
                                return area.departement.code;
                            }

                            return area[area.type].name;
                        });
                    if (areaNames.length === 0) {
                        return name;
                    }

                    return `${name} (${areaNames.join(", ")})`;
                }
            );
            if (users.length === 1) {
                return names[0];
            }

            return [
                names.slice(0, names.length - 1).join(", "),
                "et",
                names.slice(-1)[0],
            ].join(" ");
        }

        case "shantytown-creation":
            return "Nouveau site";

        case "shantytown-closing":
            if (activity.value.shantytown.closedWithSolutions === true) {
                return "Site résorbé";
            }

            return "Site fermé";

        case "comment-creation": {
            return "Nouveau message";
        }

        case "electricity-creation":
            return "Nouvel accès à l'électricité";

        case "electricity-closing":
            return "Accès à l'électricité perdu";

        case "water-creation":
            return "Nouvel accès à l'eau";

        case "water-closing":
            return "Accès à l'eau perdu";
        case "question-creation":
            return "Nouvelle question";
        case "answer-creation":
            return "Nouvelle réponse";

        default:
            return "Événement inconnu";
    }
});

const subtitle = computed(() => {
    switch (event.value) {
        case "user-creation":
            return `${
                activity.value.users.length > 1 ? "ont" : "a"
            } rejoint la plateforme`;

        case "comment-creation":
            if (activity.value.actionEntity) {
                return "dans le journal de l'action";
            }

            return "dans le journal du site";

        case "shantytown-creation":
            return "déclaré";

        case "shantytown-closing":
            if (activity.value.shantytown.closedWithSolutions !== true) {
                return "hors résorption";
            }

            return "";
        case "question-creation":
            return "dans l'espace d'entraide";
        case "answer-creation":
            return "dans l'espace d'entraide";

        default:
            return "";
    }
});

const resorptionTarget = computed(() => {
    if (activity.value.entity === "shantytown") {
        return activity.value.shantytown.resorptionTarget || null;
    }

    return null;
});

const description = computed(() => {
    if (activity.value.entity === "comment") {
        return activity.value.comment.description;
    }

    if (activity.value.entity === "question") {
        return activity.value.question.question;
    }

    if (activity.value.entity === "answer") {
        return activity.value.answer.description;
    }

    return null;
});

const icon = computed(() => {
    if (activity.value.entity === "shantytown") {
        return "map-marker-alt";
    }

    if (activity.value.entity === "user") {
        return "user";
    }

    if (activity.value.entity === "comment") {
        return "comment";
    }

    if (activity.value.entity === "electricity") {
        return "bolt";
    }

    if (activity.value.entity === "water") {
        return "tint";
    }

    if (activity.value.entity === "question") {
        return "question";
    }

    if (activity.value.entity === "answer") {
        return "comments";
    }

    return "question";
});

const iconColor = computed(() => {
    switch (event.value) {
        case "user-creation":
            return colors.orange;

        case "comment-creation":
            if (activity.value.actionEntity) {
                return colors.green;
            }

            return colors.blue;

        case "shantytown-creation":
            return colors.blue;

        case "shantytown-closing":
            if (activity.value.shantytown.closedWithSolutions === true) {
                return colors.green;
            }

            return colors.gray;

        case "electricity-creation":
        case "water-creation":
            return colors.green;

        default:
            return colors.gray;
    }
});

function routeToDetails() {
    trackEvent("TB", "Visite activité");

    if (activity.value.entity === "comment") {
        if (activity.value.actionEntity) {
            return router.push(
                `/action/${activity.value.actionEntity.id}/#comment`
            );
        }

        return router.push(
            `/site/${activity.value.shantytown.id}#message${activity.value.comment.id}`
        );
    }

    if (activity.value.entity === "user") {
        if (activity.value.users.length === 1) {
            return router.push(
                `/structure/${activity.value.users[0].organization}`
            );
        }

        return router.push("/communaute");
    }

    if (activity.value.entity === "question") {
        return router.push(`/question/${activity.value.question.id}`);
    }

    if (activity.value.entity === "answer") {
        return router.push(
            `/question/${activity.value.question.id}#reponse${activity.value.answer.id}`
        );
    }
    if (activity.value.shantytown) {
        return router.push(`/site/${activity.value.shantytown.id}`);
    }
}
</script>
