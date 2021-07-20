<template>
    <div class="flex">
        <aside
            class="text-xl w-10 h-10 rounded-full text-white text-center mr-4 bg-primary"
        >
            <Icon :icon="icon"></Icon>
        </aside>
        <div class="flex-grow">
            <component :is="bodyComponent" :activity="activity"></component>

            <footer class="flex justify-between pt-2">
                <span class="text-G500">{{
                    formatDateSinceActivity(activity.date)
                }}</span>
                <Button
                    variant="primaryText"
                    icon="arrow-right"
                    class="text-display-sm hover:underline"
                    :padding="false"
                    >{{ seeMoreWording }}</Button
                >
            </footer>
        </div>
    </div>
</template>

<script>
import formatDateSinceActivity from "#app/pages/TownsList/formatDateSinceActivity";
import ActivityCardBodyShantytownCreated from "./ActivityCardBody/ActivityCardBodyShantytownCreated.vue";
import ActivityCardBodyShantytownUpdated from "./ActivityCardBody/ActivityCardBodyShantytownUpdated.vue";
import ActivityCardBodyShantytownClosed from "./ActivityCardBody/ActivityCardBodyShantytownClosed.vue";
import ActivityCardBodyCommentCreated from "./ActivityCardBody/ActivityCardBodyCommentCreated.vue";

export default {
    components: {
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
        type() {
            return `${this.activity.action}-${this.activity.entity}`;
        },
        icon() {
            if (this.activity.entity === "shantytown") {
                return "map-marker-alt";
            }

            return "comment";
        },
        seeMoreWording() {
            if (this.activity.entity === "shantytown") {
                return "Voir le site";
            }

            return "Voir le commentaire";
        },
        // eslint-disable-next-line vue/return-in-computed-property
        bodyComponent() {
            switch (this.type) {
                case "creation-shantytown":
                    return ActivityCardBodyShantytownCreated;

                case "update-shantytown":
                    return ActivityCardBodyShantytownUpdated;

                case "closing-shantytown":
                    return ActivityCardBodyShantytownClosed;

                case "creation-comment":
                    return ActivityCardBodyCommentCreated;
            }
        }
    },

    methods: {
        formatDateSinceActivity
    }
};
</script>
