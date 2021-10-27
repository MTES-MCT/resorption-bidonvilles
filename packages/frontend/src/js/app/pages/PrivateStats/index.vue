<template>
    <PrivateLayout>
        <PrivateContainer class="py-4">
            <div class="flex">
                <LeftColumn :departements="departements" class="print:hidden" />
                <div class="pt-8 ml-32 print:ml-0 flex-1 pb-32">
                    <div
                        class="text-display-lg text-primary flex justify-between"
                    >
                        <div>
                            <span v-if="territory.code"
                                >{{ territory.code }} -</span
                            >
                            {{ territory.name }}
                        </div>
                        <Button
                            icon="print"
                            iconPosition="left"
                            variant="primaryOutline"
                            class="print:hidden"
                            @click="togglePrint"
                            >Imprimer</Button
                        >
                    </div>
                    <div>
                        <div v-if="stats" class="mt-8">
                            <div class="grid grid-cols-6 gap-8 mb-4">
                                <KeyMetric
                                    :value="stats.numberOfPeople || 0"
                                    label="habitants"
                                />
                                <KeyMetric
                                    :value="stats.numberOfShantytown || 0"
                                    label="sites"
                                />
                                <KeyMetric
                                    :value="
                                        stats.numberOfResorbedShantytown || 0
                                    "
                                    label="résorptions"
                                    info="depuis janv. 2019"
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
                            <div class="text-sm">
                                <span class="font-bold">Site résorbé : </span
                                >une solution pérenne en logement ou hébergement
                                a été mise en place pour 66 % des habitants du
                                site
                            </div>
                            <div class="text-sm">
                                <span class="font-bold">Complétion : </span
                                >pourcentage d'informations renseignées sur la
                                fiche d'un site
                            </div>
                        </div>
                        <Spinner v-else />
                    </div>

                    <div>
                        <h2 class="text-display-md text-primary mb-4 mt-8">
                            Suivi des sites
                        </h2>
                        <div v-if="stats">
                            <BarChart
                                :chartData="shantytownsEvolutionData"
                                :options="{
                                    maintainAspectRatio: false,
                                    scales: {
                                        yAxes: [
                                            { ticks: { beginAtZero: true } }
                                        ]
                                    }
                                }"
                                :height="250"
                            />
                            <LineChart
                                :chartData="shantytownsTotalEvolutionData"
                                :options="{
                                    maintainAspectRatio: false,
                                    scales: {
                                        yAxes: [
                                            { ticks: { beginAtZero: true } }
                                        ]
                                    }
                                }"
                                :height="250"
                            />
                        </div>

                        <Spinner v-else />
                    </div>

                    <div>
                        <h2 class="text-display-md text-primary mb-4 mt-16">
                            Nombre d'habitants en bidonvilles
                        </h2>

                        <div v-if="stats">
                            <LineChart
                                :chartData="populationTotalEvolutionData"
                                :options="{
                                    maintainAspectRatio: false,
                                    scales: {
                                        yAxes: [
                                            { ticks: { beginAtZero: true } }
                                        ]
                                    }
                                }"
                                :height="250"
                            />
                            <div class="mt-4 text-sm text-center">
                                La donnée sur le nombre de ressortissants UE est
                                disponible uniquement à partir de mars 2021.
                            </div>
                        </div>
                        <Spinner v-else />
                    </div>

                    <div>
                        <h2 class="text-display-md text-primary  mt-16 mb-4">
                            Suivi des dispositifs
                        </h2>
                        <CreditsRepartition
                            v-if="stats"
                            :credits="stats.numberOfCreditsPerYear"
                        />
                        <Spinner v-else />
                    </div>

                    <div>
                        <h2 class="text-display-md text-primary mb-4 mt-16">
                            Suivi plateforme
                        </h2>
                        <div>
                            <Spinner v-if="!matomoStats" />
                            <div class="chartWrapper" v-else>
                                <LineChart
                                    :chartData="matomoStats"
                                    :options="{
                                        maintainAspectRatio: false,
                                        scales: {
                                            yAxes: [
                                                { ticks: { beginAtZero: true } }
                                            ]
                                        }
                                    }"
                                    :height="250"
                                />
                            </div>
                        </div>
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
        togglePrint() {
            window.print();
        },
        loadData() {
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
                const segment = `segment=customVariableValue1==false,customVariableValue1=@${encodeURIComponent(
                    "superuser:false"
                )}${
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

            return territory || { name: "France" };
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
                    const newShantytowns = this.stats
                        .numberOfNewShantytownsPerMonth[index];
                    const closedShantytowns = this.stats
                        .numberOfClosedShantytownsPerMonth[index];
                    const resorbedShantytowns = this.stats
                        .numberOfResorbedShantytownsPerMonth[index];

                    const monthDiff =
                        parseInt(
                            newShantytowns ? newShantytowns.total : 0,
                            10
                        ) -
                        parseInt(
                            closedShantytowns ? closedShantytowns.total : 0,
                            10
                        ) -
                        parseInt(
                            resorbedShantytowns ? resorbedShantytowns.total : 0,
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
        },

        populationTotalEvolutionData() {
            if (this.stats.populationTotal === null) {
                return [];
            }

            const {
                total,
                totalEU,
                totalLivingInTownsBiggerThan10,
                totalEULivingInTownsBiggerThan10
            } = this.stats.populationTotal.reduce(
                (
                    acc,
                    {
                        total,
                        totalEU,
                        totalLivingInTownsBiggerThan10,
                        totalEULivingInTownsBiggerThan10
                    }
                ) => {
                    acc.total.push(total);
                    acc.totalEU.push(totalEU);
                    acc.totalLivingInTownsBiggerThan10.push(
                        totalLivingInTownsBiggerThan10
                    );
                    acc.totalEULivingInTownsBiggerThan10.push(
                        totalEULivingInTownsBiggerThan10
                    );
                    return acc;
                },
                {
                    total: [],
                    totalEU: [],
                    totalLivingInTownsBiggerThan10: [],
                    totalEULivingInTownsBiggerThan10: []
                }
            );
            return {
                labels: this.stats.populationTotal.map(({ month }) => month),
                datasets: [
                    {
                        backgroundColor: "#E5E5F4",
                        data: total,
                        label: "Nombre d'habitants"
                    },
                    {
                        backgroundColor: "#5770BE",
                        data: totalEU,
                        label: "Nombre de ressortissants UE"
                    },
                    {
                        backgroundColor: "#FF8D7E",
                        data: totalLivingInTownsBiggerThan10,
                        label:
                            "Nombre total d'habitants vivant dans des sites de 10 personnes ou plus"
                    },
                    {
                        backgroundColor: "#169B62",
                        data: totalEULivingInTownsBiggerThan10,
                        label:
                            "Nombre de ressortissants UE vivant dans des sites de 10 personnes ou plus"
                    }
                ]
            };
        }
    },
    watch: {
        "$route.params.code": function() {
            this.loadData();
        }
    }
};
</script>
