<template>
    <div class="border-t-1 border-G400 py-4">
        <div class="flex justify-between">
            <div class="text-G600 text-sm mb-1">
                {{ formatDate(comment.createdAt, "d M y à h:i") }}
            </div>
            <span
                ><Icon
                    class="text-red cursor-pointer"
                    icon="trash-alt"
                    alt="Supprimer le message"
                    v-if="canDeleteMessage"
            /></span>
        </div>
        <div
            class="text-G600 text-sm mb-1"
            v-if="comment.covid && comment.covid.date"
        >
            Date de l'intervention:
            {{ formatDate(comment.covid.date, "d M y à h:i") }}
        </div>
        <div v-if="comment.private" class="font-bold">
            <Icon icon="lock" class="text-red" />
            Message réservé aux membres de la préfecture et DDETS de votre
            territoire.
        </div>
        <div class="text-primary font-bold mb-1">
            <router-link :to="`/annuaire/${comment.createdBy.organization_id}`">
                <Icon icon="user" /> {{ comment.createdBy.first_name }}
                {{ comment.createdBy.last_name }} -
                {{ comment.createdBy.organization }}
            </router-link>
        </div>
        <div class="ml-5">
            <div class="flex flex-wrap">
                <Tag
                    v-if="!!comment.covid"
                    variant="withoutBackground"
                    :class="['inline-block', 'bg-red', 'text-white']"
                    >Covid-19</Tag
                >
                <CovidTag
                    v-for="tag in covidTags"
                    :key="tag.prop"
                    :class="['mr-2', 'mb-2']"
                    :tag="tag"
                />
            </div>
            <div class="whitespace-pre-line">{{ comment.description }}</div>
        </div>
    </div>
</template>

<script>
import CovidTag from "#app/components/CovidTag/CovidTag.vue";
import covidTags from "#app/pages/CovidHistory/covidTags";

export default {
    components: {
        CovidTag
    },
    props: {
        comment: {
            type: Object
        }
    },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        }
    },
    computed: {
        covidTags: function() {
            if (!this.comment || !this.comment.covid) {
                return [];
            }

            return covidTags.filter(t => {
                return !!this.comment.covid[t.prop];
            });
        },
        isOwner() {
            return (
                this.comment.createdBy.id ===
                this.$store.state.config.configuration.user.id
            );
        },
        canDeleteMessage() {
            return (
                this.isOwner === true ||
                this.$store.getters["config/hasPermission"](
                    "shantytown_comment.moderate"
                )
            );
        }
    }
};
</script>
