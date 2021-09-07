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
        <p>
            <span class="font-bold">Message :</span>
            {{ description }}
        </p>
    </div>
</template>

<script>
import CovidTag from "#app/components/CovidTag/CovidTag.vue";
import covidTags from "#app/pages/covid/covidTags";

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
