<template>
    <span v-if="variant === 'small'"></span>
    <div v-else>
        <div>
            <CovidTag
                v-for="tag in covidTags"
                :key="tag.prop"
                :class="['mr-2', 'mb-2']"
                :tag="tag"
            />
        </div>
        <div
            class="mb-2"
            v-if="
                activity.comment.user_target_name.length > 0 ||
                    activity.comment.organization_target_name.length > 0
            "
        >
            <Icon icon="lock" class="text-red" />
            <span class="pl-1 font-bold"
                >Message réservé aux structures et utilisateurs suivants :</span
            >
            <div v-for="user in activity.comment.user_target_name" :key="user">
                - {{ user }}
            </div>
            <div
                v-for="organization in activity.comment
                    .organization_target_name"
                :key="organization"
            >
                - {{ organization }}
            </div>
        </div>
        <p>
            <span class="font-bold">Message :</span>
            {{ description }}
        </p>
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
        activity: {
            type: Object,
            required: true
        },
        variant: {
            // voir "ActivityCard.vue"
            type: String,
            required: true
        }
    },
    computed: {
        description() {
            return this.activity.highCovidComment
                ? this.activity.highCovidComment.description
                : this.activity.comment.description;
        },

        covidTags: function() {
            if (!this.activity.comment || !this.activity.comment.covid) {
                return [];
            }

            return covidTags.filter(t => {
                return !!this.activity.comment.covid[t.prop];
            });
        }
    }
};
</script>
