<template>
    <PublicLayout :stickyHeader="false">
        <PublicContainer class="py-16" v-if="state === 'loading'">
            <div class="text-center text-primary text-display-lg mt-16 h-96">
                <Spinner />
            </div>
        </PublicContainer>
        <PublicContainer class="py-16" v-else>
            <div>
                <h1 class="text-display-xl">Statistiques</h1>
                <div>
                    Depuis l'ouverture nationale de la plateforme en juin 2019
                </div>
            </div>

            <h2 class="text-display-lg text-secondary mt-16">
                Répartition des utilisateurs
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 mt-4">
                <div>
                    <PieChart
                        class="mb-16 md:mb-0 md:mr-16"
                        height="250px"
                        :chartData="organizationRepartitionData"
                        :options="{
                            legend: {
                                position: 'right',
                                align: 'start',
                                labels: {
                                    generateLabels
                                }
                            },
                            maintainAspectRatio: false
                        }"
                    />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <StatsBlock
                        :title="numberOfDepartements"
                        icon="flag"
                        subtitle="départements"
                    />
                    <StatsBlock
                        :title="numberOfNewUsers.total"
                        icon="user-plus"
                        :subtitle="
                            'nouveaux utilisateurs en ' +
                                numberOfNewUsers.month.toLowerCase()
                        "
                    />
                </div>
            </div>

            <div v-if="numberOfNewUsersPerMonth !== null">
                <h2 class="text-display-lg text-secondary mt-16 mb-4">
                    Nombre d'utilisateurs
                </h2>
                <div class="chartWrapper">
                    <LineChart
                        :chartData="usersEvolutionData"
                        :options="{ maintainAspectRatio: false }"
                        height="250px"
                    />
                </div>
            </div>

            <div class="mt-16">
                <h2 class="text-display-lg text-secondary mb-4">
                    Nombre d'utilisateurs par semaine
                </h2>
                <div class="chartWrapper">
                    <LineChart
                        :chartData="matomoStats"
                        :options="{ maintainAspectRatio: false }"
                        height="250px"
                    />
                </div>
            </div>

            <StatsSection title="Usage" class="mt-16">
                <StatsBlock
                    :title="numberOfExports"
                    icon="file-download"
                    subtitle="extractions de données réalisées"
                    info="Les exports Excel permettent aux acteurs locaux d'utiliser et d'analyser les données afin de suivre, communiquer et optimiser les actions de résorption depuis le 15/11/2019."
                />
                <StatsBlock
                    :title="numberOfComments"
                    icon="comment"
                    subtitle="commentaires créés"
                    info="Au delà du suivi des chiffrés, les commentaires permettent de suivre et de partager des informations qualitative utiles dans une action multi-partenariale."
                />
                <StatsBlock
                    :title="numberOfDirectoryViews"
                    icon="address-book"
                    subtitle="fiches contact consultées"
                    info="L'annuaire permet d'accéder aux coordonnées de tous les utilisateurs de la plateforme. Son utilisation participe à la mise en réseau partenaires locaux ou des pairs depuis le 15/11/2019"
                />
            </StatsSection>

            <StatsSection title="Fréquence de mise à jour" class="mt-16">
                <template v-slot:info
                    ><span class="text-secondary"
                        ><font-awesome-icon icon="sync"
                    /></span>
                    La mise à jour régulière des données garantissent des
                    informations justes à tous les acteurs.</template
                >
                <template v-slot:default>
                    <StatsBlock
                        :title="meanTimeBeforeCreationDeclaration"
                        subtitle="jours entre l'installation d'un bidonville ou squat et sa déclaration"
                        info="Médiane depuis le 01/09/2019."
                    />
                    <StatsBlock
                        :title="meanTimeBeforeClosingDeclaration"
                        subtitle="jours entre la fermeture du site et sa déclaration"
                        info="Médiane depuis le 01/09/2019."
                    />
                    <StatsBlock
                        :title="numberOfShantytownOperations"
                        subtitle="mises à jour de bidonvilles et squats"
                        info="Toutes opérations confondues : création, modification, fermeture"
                    />
                </template>
            </StatsSection>
        </PublicContainer>
    </PublicLayout>
</template>

<script>
import PublicLayout from "#app/components/PublicLayout/index.vue";
import PublicContainer from "#app/components/PublicLayout/PublicContainer.vue";
import StatsBlock from "./StatsBlock.vue";
import StatsSection from "./StatsSection.vue";
import { all as getStats } from "#helpers/api/stats";
import LineChart from "./LineChart";
import PieChart from "./PieChart";

export default {
    components: {
        PublicLayout,
        PublicContainer,
        StatsSection,
        StatsBlock,
        LineChart,
        PieChart
    },
    data() {
        return {
            state: null,
            error: null,
            stats: null,
            matomoStats: null
        };
    },
    created() {
        this.load();
    },

    computed: {
        numberOfDepartements() {
            return this.stats ? this.stats.numberOfDepartements : "...";
        },

        numberOfTerritorialCollectivitieUsers() {
            return this.stats
                ? this.stats.numberOfCollaboratorAndAssociationUsers
                      .territorial_collectivity || 0
                : "...";
        },

        numberOfAssociationUsers() {
            return this.stats
                ? this.stats.numberOfCollaboratorAndAssociationUsers
                      .association || 0
                : "...";
        },

        numberOfPublicEstablishmentUsers() {
            return this.stats
                ? this.stats.numberOfCollaboratorAndAssociationUsers
                      .public_establishment || 0
                : "...";
        },

        numberOfAdministrationUsers() {
            return this.stats
                ? this.stats.numberOfCollaboratorAndAssociationUsers
                      .administration || 0
                : "...";
        },

        numberOfExports() {
            return this.stats ? this.stats.numberOfExports : "...";
        },

        numberOfComments() {
            return this.stats ? this.stats.numberOfComments : "...";
        },

        numberOfDirectoryViews() {
            return this.stats ? this.stats.numberOfDirectoryViews : "...";
        },

        numberOfNewUsersPerMonth() {
            return (this.stats && this.stats.numberOfNewUsersPerMonth) || null;
        },

        usersEvolutionData() {
            if (
                this.numberOfNewUsersPerMonth === null ||
                this.stats.numberOfUsersOnJune2020 === null
            ) {
                return [];
            }

            const initialValue = parseInt(
                this.stats.numberOfUsersOnJune2020,
                10
            );

            const cumulativeData = this.numberOfNewUsersPerMonth.reduce(
                (acc, { total }, index) =>
                    index === 0
                        ? [parseInt(total, 10) + initialValue]
                        : [...acc, parseInt(total, 10) + acc[acc.length - 1]],
                []
            );

            return {
                labels: this.numberOfNewUsersPerMonth.map(({ month }) => month),
                datasets: [
                    {
                        backgroundColor: ["#E5E5F4"],
                        data: cumulativeData,
                        label: "Nombre d'utilisateurs"
                    }
                ]
            };
        },

        organizationRepartitionData() {
            return {
                labels: [
                    "services de l'État",
                    "collectivités territoriales",
                    "associations",
                    "administration"
                ],
                datasets: [
                    {
                        backgroundColor: [
                            "#169B62",
                            "#5770BE",
                            "#FF8D7E",
                            "#6A6A6A"
                        ],
                        data: [
                            this.numberOfPublicEstablishmentUsers,
                            this.numberOfTerritorialCollectivitieUsers,
                            this.numberOfAssociationUsers,
                            this.numberOfAdministrationUsers
                        ],
                        label: "utilisateurs institutionnels et associatifs"
                    }
                ]
            };
        },

        numberOfNewUsers() {
            return this.stats && this.stats.numberOfNewUsersPerMonth
                ? this.stats.numberOfNewUsersPerMonth.slice(-1)[0]
                : { total: "...", month: "..." };
        },

        meanTimeBeforeCreationDeclaration() {
            return this.stats
                ? Math.round(
                      this.stats.meanTimeBeforeCreationDeclaration.average
                  ) || "?"
                : "...";
        },

        meanTimeBeforeClosingDeclaration() {
            return this.stats
                ? Math.round(
                      this.stats.meanTimeBeforeClosingDeclaration.average
                  ) || "?"
                : "...";
        },

        numberOfShantytownOperations() {
            return this.stats ? this.stats.numberOfShantytownOperations : "...";
        }
    },
    methods: {
        // Generate custom labels for user repartition
        generateLabels(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
                return data.labels.map(function(label, i) {
                    // We get the value of the current label
                    const value = chart.config.data.datasets[0].data[i];
                    const background =
                        chart.config.data.datasets[0].backgroundColor[i];

                    return {
                        text: label + " : " + value,
                        index: i,
                        fillStyle: background
                    };
                });
            } else {
                return [];
            }
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
                )}`;

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
        },
        /**
         * Tries fetching the data from the API
         *
         * Please note that this cannot be done if the data has already been loaded
         * before.
         */
        load() {
            if (this.state === "loading") {
                return;
            }

            this.state = "loading";
            this.error = null;

            this.getMatomoStats();

            getStats()
                .then(({ statistics: stats }) => {
                    this.stats = stats;
                    this.state = "loaded";
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                    this.state = "error";
                });
        }
    }
};
</script>

<style scoped>
.chartWrapper {
    max-height: 300px;
    position: relative;
}
</style>
