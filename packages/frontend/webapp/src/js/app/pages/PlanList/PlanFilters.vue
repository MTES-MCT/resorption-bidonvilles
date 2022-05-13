<template>
    <nav>
        <p class="mb-2">Filtrer par</p>
        <div class="flex">
            <CustomFilter
                class="mr-2"
                title="Champs d'intervention"
                :options="topicOptions"
                v-model="topicFilter"
            />
            <CustomFilter
                title="Lieu d'intervention"
                :options="interventionLocationFilters"
                v-model="interventionLocationFilter"
            />
        </div>
    </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters({
            interventionLocationFilters: "plansInterventionLocation"
        }),
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
        },
        interventionLocationFilter: {
            get() {
                return this.$store.state.plans.interventionLocationFilter;
            },
            set(value) {
                this.$store.commit("setInterventionLocationFilter", value);
            }
        }
    }
};
</script>
