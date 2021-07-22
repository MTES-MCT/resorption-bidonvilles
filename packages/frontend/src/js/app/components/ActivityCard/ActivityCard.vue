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
                <p>
                    site :
                    <Link :to="`/site/${activity.shantytown.id}`"
                        >{{ activity.shantytown.usename }},
                        {{ activity.shantytown.city.name }}</Link
                    >
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
                    :href="`/site/${activity.shantytown.id}`"
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

            return "Voir le message";
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
