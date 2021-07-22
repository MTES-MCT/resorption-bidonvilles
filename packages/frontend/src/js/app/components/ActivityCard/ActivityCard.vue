<template>
    <div
        class="flex"
        @mouseenter="moreIsHover = true"
        @mouseleave="moreIsHover = false"
    >
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
                <Button
                    variant="primaryText"
                    icon="arrow-right"
                    iconPosition="left"
                    class="text-display-sm hover:underline"
                    :padding="false"
                    :href="link"
                    ><span v-if="variant !== 'small' || moreIsHover">{{
                        seeMoreWording
                    }}</span></Button
                >
            </footer>
        </div>
    </div>
</template>

<script>
import formatDate from "./utils/formatDate";
import ActivityCardIcon from "./ActivityCardIcon.vue";
import ActivityCardBodyShantytownCreated from "./ActivityCardBody/ActivityCardBodyShantytownCreated.vue";
import ActivityCardBodyShantytownUpdated from "./ActivityCardBody/ActivityCardBodyShantytownUpdated.vue";
import ActivityCardBodyShantytownClosed from "./ActivityCardBody/ActivityCardBodyShantytownClosed.vue";
import ActivityCardBodyCommentCreated from "./ActivityCardBody/ActivityCardBodyCommentCreated.vue";

export default {
    components: {
        ActivityCardIcon,
        ActivityCardBodyShantytownCreated,
        ActivityCardBodyShantytownUpdated,
        ActivityCardBodyShantytownClosed,
        ActivityCardBodyCommentCreated
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
        return {
            moreIsHover: false
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
            if (this.activity.covid || this.activity.highCovid) {
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
                    if (this.activity.covid || this.activity.highCovid) {
                        return "Nouveau message Covid-19";
                    }

                    return "Nouveau message";
            }
        },
        // eslint-disable-next-line vue/return-in-computed-property
        bodyComponent() {
            switch (`${this.activity.action}-${this.activity.entity}`) {
                case "creation-shantytown":
                    return ActivityCardBodyShantytownCreated;

                case "update-shantytown":
                    return ActivityCardBodyShantytownUpdated;

                case "closing-shantytown":
                    return ActivityCardBodyShantytownClosed;

                case "creation-comment":
                    return ActivityCardBodyCommentCreated;
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
        }
    },

    methods: {
        formatDate
    }
};
</script>
