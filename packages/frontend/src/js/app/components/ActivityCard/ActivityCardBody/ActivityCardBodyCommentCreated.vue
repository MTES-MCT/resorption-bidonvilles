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
        <p><span class="font-bold">Message :</span> {{ activity.content }}</p>
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
        covidTags: function() {
            if (!this.activity.covid) {
                return [];
            }

            return covidTags.filter(t => {
                return !!this.activity.covid[t.prop];
            });
        }
    }
};
</script>
