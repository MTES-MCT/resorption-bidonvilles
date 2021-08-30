<template>
    <div
        class="flex"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <ActivityCardModerationModal
            v-if="activity.comment"
            ref="moderationModal"
            :activity="activity"
        />

        <div :class="classes.column">
            <ActivityCardIcon
                :color="colors.bg"
                :activity="activity"
                class="mr-4 flex-shrink-0"
            ></ActivityCardIcon>
        </div>

        <div class="flex-grow" :class="classes.column">
            <header>
                <h1 :class="classes.title">
                    {{ title }}
                </h1>
                <p :class="classes.author">
                    par :
                    <Link :to="`/annuaire/${activity.author.organization}`">{{
                        activity.author.name
                    }}</Link>
                </p>
                <p v-if="activity.shantytown.id">
                    site :
                    <Link :to="`/site/${activity.shantytown.id}`"
                        >{{ activity.shantytown.usename }},
                        {{ activity.shantytown.city.name }}</Link
                    >
                </p>
                <p v-if="activity.highCovid">
                    territoire(s) :
                    {{
                        activity.highCovid.departements
                            .map(({ name }) => name)
                            .join(", ")
                    }}
                </p>
            </header>

            <component
                :is="bodyComponent"
                :activity="activity"
                :variant="variant"
                class="mt-4"
            ></component>

            <footer class="flex justify-between pt-2">
                <span class="text-G500">{{ formatDate(activity.date) }}</span>
                <div>
                    <Button
                        variant="secondaryText"
                        icon="trash-alt"
                        iconPosition="left"
                        class="text-display-sm mr-4"
                        :padding="false"
                        v-if="showModerationButton && isHover"
                        @click="openModerationModal"
                        >Supprimer le message</Button
                    >
                    <Button
                        variant="primaryText"
                        icon="arrow-right"
                        iconPosition="right"
                        class="text-display-sm hover:underline"
                        :padding="false"
                        :href="link"
                        ><span v-if="variant !== 'small' || isHover">{{
                            seeMoreWording
                        }}</span></Button
                    >
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
import { get as getConfig, getPermission } from "#helpers/api/config";
import formatDate from "./utils/formatDate";
import ActivityCardIcon from "./ActivityCardIcon.vue";
import ActivityCardBodyShantytownUpdated from "./ActivityCardBody/ActivityCardBodyShantytownUpdated.vue";
import ActivityCardBodyCommentCreated from "./ActivityCardBody/ActivityCardBodyCommentCreated.vue";
import ActivityCardModerationModal from "./ActivityCardModerationModal.vue";

export default {
    components: {
        ActivityCardIcon,
        ActivityCardBodyShantytownUpdated,
        ActivityCardBodyCommentCreated,
        ActivityCardModerationModal
    },

    props: {
        activity: {
            type: Object,
            required: true
        },
        variant: {
            type: String, // either "normal" or "small"
            default: "normal",
            required: false
        }
    },

    data() {
        const { user } = getConfig() || {};

        return {
            user,
            permission: getPermission("shantytown_comment.moderate"),
            isHover: false
        };
    },

    computed: {
        colors() {
            if (this.activity.entity === "shantytown") {
                if (this.activity.action === "update") {
                    return {
                        text: "text-info",
                        bg: "bg-info"
                    };
                } else if (this.activity.action === "closing") {
                    return {
                        text: "text-G600",
                        bg: "bg-G600"
                    };
                }

                // ouverture de site
                return {
                    text: "text-black",
                    bg: "bg-black"
                };
            }

            // création de commentaire
            if (
                (this.activity.comment && this.activity.comment.covid) ||
                this.activity.highCovid
            ) {
                return {
                    text: "text-error",
                    bg: "bg-error"
                };
            }

            return {
                text: "text-orange600",
                bg: "bg-orange600"
            };
        },
        // eslint-disable-next-line vue/return-in-computed-property
        title() {
            switch (`${this.activity.action}-${this.activity.entity}`) {
                case "creation-shantytown":
                    return "Nouveau site";

                case "update-shantytown":
                    return "Site modifié";

                case "closing-shantytown":
                    return "Fermeture d'un site";

                case "creation-comment":
                    if (
                        (this.activity.comment &&
                            this.activity.comment.covid) ||
                        this.activity.highCovid
                    ) {
                        return "Nouveau message Covid-19";
                    }

                    return "Nouveau message";
            }
        },
        bodyComponent() {
            switch (`${this.activity.action}-${this.activity.entity}`) {
                case "creation-comment":
                    return ActivityCardBodyCommentCreated;

                case "update-shantytown":
                    return ActivityCardBodyShantytownUpdated;

                default:
                    return null;
            }
        },
        seeMoreWording() {
            if (this.activity.entity === "shantytown") {
                return "Voir la fiche du site";
            }

            if (this.activity.highCovid) {
                return "Voir les messages Covid-19";
            }

            return "Voir le message";
        },
        // eslint-disable-next-line vue/return-in-computed-property
        link() {
            if (this.activity.entity === "comment") {
                if (this.activity.highCovid) {
                    return "/covid-19";
                }

                return `/site/${this.activity.shantytown.id}#message${this.activity.comment_id}`;
            }

            return `/site/${this.activity.shantytown.id}`;
        },
        classes() {
            return {
                title: {
                    [`${this.colors.text} font-bold mt-2`]: true,
                    "inline-block": this.variant === "small"
                },
                author: {
                    "inline-block ml-2": this.variant === "small"
                },
                column: {
                    "border-b py-2": this.variant === "small"
                }
            };
        },
        showModerationButton() {
            // on vérifie que l'activité en question est modérable (= un commentaire ou un commentaire COVID non territoire)
            if (
                this.activity.entity !== "comment" ||
                this.activity.highCovid ||
                this.variant === "small"
            ) {
                return false;
            }

            // on vérifie que l'utilisateur a le droit de modérer
            if (this.permission === null || !this.permission.allowed) {
                return false;
            }

            if (
                this.permission.geographic_level === "nation" ||
                this.user.organization.location.type === "nation"
            ) {
                return true;
            }

            // on vérifie qu'il a le droit de modérer spécifiquement ce commentaire
            const locationType =
                this.user.organization.location.type === "region"
                    ? "region"
                    : "departement";

            return (
                this.activity.shantytown[locationType].code ===
                this.user.organization.location[locationType].code
            );
        }
    },

    methods: {
        formatDate,
        openModerationModal() {
            this.$refs.moderationModal.open();
        }
    }
};
</script>
