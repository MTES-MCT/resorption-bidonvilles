<template>
    <PrivateLayout>
        <PrivateContainer class="py-4">
            <div v-if="!stats">
                <Spinner />
            </div>
            <div class="flex">
                <LeftColumn :departements="departements" />
                <div class="pt-8 ml-32 flex-1">
                    <div class="text-display-lg text-primary">
                        <span v-if="territory.code"
                            >{{ territory.code }} -</span
                        >
                        {{ territory.name }}
                    </div>
                    <div class="grid grid-cols-6 gap-8 mt-8 mb-16">
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
                        <KeyMetric
                            :value="
                                stats.averageCompletionPercentage
                                    ? (
                                          stats.averageCompletionPercentage *
                                          100
                                      ).toFixed(2) + '%'
                                    : 0
                            "
                            label="completion"
                        />
                    </div>
                    <div>
                        <BarChart
                            :chartData="shantytownsEvolutionData"
                            :options="{ maintainAspectRatio: false }"
                            :height="250"
                        />
                    </div>
                    <div class="mt-16">
                        <LineChart
                            :chartData="shantytownsTotalEvolutionData"
                            :options="{ maintainAspectRatio: false }"
                            :height="250"
                        />
                    </div>
                    <div class="mt-16">
                        <div class="chartWrapper">
                            <LineChart
                                :chartData="matomoStats"
                                :options="{ maintainAspectRatio: false }"
                                :height="250"
                            />
                        </div>
                    </div>
                    <CreditsRepartition
                        class="mt-16"
                        :credits="stats.numberOfCreditsPerYear"
                    />
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
import BarChart from "#app/pages/PrivateStats/BarChart";
import LineChart from "#app/pages/PrivateStats/LineChart";
import CreditsRepartition from "#app/pages/PrivateStats/CreditsRepartition";

export default {
    components: {
        CreditsRepartition,
        BarChart,
        LineChart,
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
            this.getMatomoStats();
            all(this.$route.params.code)
                .then(({ statistics: stats }) => {
                    this.stats = stats;
                    this.fetching = false;
                })
                .catch(({ user_message: userMessage }) => {
                    this.fetching = false;
                    this.error = userMessage;
                });
        },
        async getMatomoStats() {
            const getLastSunday = d => {
                const t = new Date(d);
                t.setDate(t.getDate() - t.getDay());
                return t;
            };

            const getDate = (d, delta) => {
                const t = new Date(d);
                t.setDate(t.getDate() - delta);
                return t;
            };

            const fetchStatsData = async date => {
                const segment = `segment=pageUrl%3D@https%25253A%25252F%25252Fresorption-bidonvilles.beta.gouv.fr%25252F%252523%25252Fcartographie${
                    this.$route.params.code
                        ? `;customVariableName5==departement_code;customVariableValue5==${this.$route.params.code}`
                        : ""
                }`;

                const url = `https://stats.data.gouv.fr/index.php?module=API&method=VisitsSummary.getUniqueVisitors&idSite=86&period=week&date=${date}&format=JSON&${segment}`;

                const res = await fetch(url);
                const result = await res.json();
                return result.value;
            };

            const lastSunday = getLastSunday(new Date());

            // Build an array of dates from the last 2 months : ["2021-01-03", "2021-01-10", ...]
            const last2MonthsWeeklyDates = Array.from(
                Array(10),
                (_, i) => i * 7
            )
                .reverse()
                .map(delta =>
                    getDate(lastSunday, delta)
                        .toISOString()
                        .slice(0, 10)
                );

            const data = await Promise.all(
                last2MonthsWeeklyDates.map(fetchStatsData)
            );

            this.matomoStats = {
                labels: last2MonthsWeeklyDates,
                datasets: [
                    {
                        backgroundColor: ["#E5E5F4"],
                        data,
                        label: "Nombre d'utilisateurs par semaine"
                    }
                ]
            };
        }
    },
    data() {
        const config = getConfig();

        return {
            departements: config.departements,
            stats: null,
            matomoStats: null,
            fetching: true
        };
    },
    computed: {
        territory() {
            const territory = this.departements.find(
                d => d.code === this.$route.params.code
            );

            return territory || { name: "France métropolitaine" };
        },

        shantytownsEvolutionData() {
            if (
                this.stats.numberOfResorbedShantytownsPerMonth === null ||
                this.stats.numberOfNewShantytownsPerMonth === null ||
                this.stats.numberOfClosedShantytownsPerMonth === null
            ) {
                return [];
            }
            return {
                labels: this.stats.numberOfNewShantytownsPerMonth.map(
                    ({ month }) => month
                ),
                datasets: [
                    {
                        backgroundColor: "#169B62",
                        data: this.stats.numberOfResorbedShantytownsPerMonth.map(
                            d => parseInt(d.total, 10)
                        ),
                        label: "Nombre de bidonvilles résorbés"
                    },
                    {
                        backgroundColor: "#FF8D7E",
                        data: this.stats.numberOfClosedShantytownsPerMonth.map(
                            d => parseInt(d.total, 10)
                        ),
                        label: "Nombre de bidonvilles fermés"
                    },
                    {
                        backgroundColor: "#5770BE",
                        data: this.stats.numberOfNewShantytownsPerMonth.map(d =>
                            parseInt(d.total, 10)
                        ),
                        label: "Nombre de nouveaux bidonvilles"
                    }
                ]
            };
        },

        shantytownsTotalEvolutionData() {
            if (
                this.stats.numberOfNewShantytownsPerMonth === null ||
                this.stats.numberOfClosedShantytownsPerMonth === null
            ) {
                return [];
            }

            const initialValue = parseInt(
                this.stats.numberOfShantytownsOnJune2019,
                10
            );

            const cumulativeData = this.stats.numberOfNewShantytownsPerMonth.reduce(
                (acc, obj, index) => {
                    const monthDiff =
                        parseInt(
                            this.stats.numberOfNewShantytownsPerMonth[index]
                                .total,
                            10
                        ) -
                        parseInt(
                            this.stats.numberOfClosedShantytownsPerMonth[index]
                                .total,
                            10
                        );

                    return index === 0
                        ? [initialValue + monthDiff]
                        : [...acc, monthDiff + acc[acc.length - 1]];
                },
                []
            );

            return {
                labels: this.stats.numberOfNewShantytownsPerMonth.map(
                    ({ month }) => month
                ),
                datasets: [
                    {
                        backgroundColor: "#E5E5F4",
                        data: cumulativeData,
                        label: "Nombre total de bidonvilles"
                    }
                ]
            };
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
