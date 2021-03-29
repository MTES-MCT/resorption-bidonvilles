<template>
    <PrivateLayout>
        <PrivateContainer class="py-4">
            <div v-if="!stats">
                <Spinner />
            </div>
            <div class="flex" v-else>
                <LeftColumn :departements="departements" />
                <div class="pt-8 ml-32 flex-1">
                    <div class="text-display-lg text-primary">
                        <span v-if="territory.code"
                            >{{ territory.code }} -</span
                        >
                        {{ territory.name }}
                    </div>
                    <div class="grid grid-cols-5 gap-8 mt-8">
                        <KeyMetric
                            :value="stats.numberOfPeople || 0"
                            label="habitants"
                        />
                        <KeyMetric
                            :value="stats.numberOfShantytown || 0"
                            label="sites"
                        />
                        <KeyMetric
                            :value="stats.numberOfResorbedShantytown || 0"
                            label="résorptions"
                        />
                        <KeyMetric
                            :value="stats.numberOfPlans || 0"
                            label="dispositifs"
                        />
                        <KeyMetric
                            :value="stats.numberOfUsers || 0"
                            label="utilisateurs"
                        />
                    </div>
                </div>
            </div>
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import PrivateLayout from "#app/components/PrivateLayout";
import { get as getConfig } from "#helpers/api/config";
import LeftColumn from "#app/pages/PrivateStats/LeftColumn";
import KeyMetric from "#app/pages/PrivateStats/KeyMetric";
import { all } from "#helpers/api/stats";
import Spinner from "#app/components/ui/Spinner";

export default {
    components: {
        Spinner,
        LeftColumn,
        PrivateContainer,
        PrivateLayout,
        KeyMetric
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            console.log("loadData", this.$route.params.code);
            all(this.$route.params.code)
                .then(({ statistics: stats }) => {
                    this.stats = stats;
                    this.fetching = false;
                })
                .catch(({ user_message: userMessage }) => {
                    this.fetching = false;
                    this.error = userMessage;
                });
        }
    },
    data() {
        const config = getConfig();

        return {
            departements: config.departements,
            stats: null,
            fetching: true
        };
    },
    computed: {
        territory() {
            const territory = this.departements.find(
                d => d.code === this.$route.params.code
            );

            return territory || { name: "France métropolitaine" };
        }
    },
    watch: {
        "$route.params.code": function() {
            console.log("changeRoute", this.$route.params.code);
            this.loadData();
        }
    }
};
</script>
