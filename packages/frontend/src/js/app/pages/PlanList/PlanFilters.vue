<template>
    <nav>
        <p>Filtrer par</p>
        <CustomFilter
            title="Champs d'intervention"
            :options="topicOptions"
            v-model="topicFilter"
        />
    </nav>
</template>

<script>
import { get as getConfig } from "#helpers/api/config";

export default {
    data() {
        const { topics } = getConfig();

        return {
            topicOptions: topics.map(({ uid, name }) => ({
                id: uid,
                value: uid,
                label: name
            }))
        };
    },

    computed: {
        topicFilter: {
            get() {
                return this.$store.state.plans.topicFilter;
            },
            set(value) {
                this.$store.commit("setTopicFilter", value);
            }
        }
    }
};
</script>
