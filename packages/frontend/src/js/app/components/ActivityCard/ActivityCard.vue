<template>
    <div class="flex">
        <ActivityCardIcon
            :color="color"
            :activity="activity"
            class="mr-4 flex-shrink-0"
        ></ActivityCardIcon>

        <div class="flex-grow">
            <header>
                <h1 :class="`text-${color} font-bold leading-10`">
                    {{ title }}
                </h1>
                <p>
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
                :color="color"
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
                    >{{ seeMoreWording }}</Button
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
        }
    },

    computed: {
        color() {
            if (this.activity.entity === "shantytown") {
                if (this.activity.action === "update") {
                    return "info";
                } else if (this.activity.action === "closing") {
                    return "G600";
                }

                // ouverture de site
                return "black";
            }

            return "orange600";
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
        }
    },

    methods: {
        formatDate
    }
};
</script>
