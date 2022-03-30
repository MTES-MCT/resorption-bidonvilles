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
export default {
    computed: {
        topicOptions() {
            return this.$store.state.config.configuration.topics.map(
                ({ uid, name }) => ({
                    id: uid,
                    value: uid,
                    label: name
                })
            );
        },
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
