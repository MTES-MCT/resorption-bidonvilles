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

            <h2 class="text-display-lg text-secondary">{{ title }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 mt-16">
                <PieChart
                    class="mb-16 md:mb-0 md:mr-16"
                    :chartData="organizationRepartitionData"
                    :options="{
                        legend: {
                            position: 'bottom'
                        },
                        maintainAspectRatio: false
                    }"
                />
                <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <StatsBlock
                        :title="numberOfDepartements"
                        icon="flag"
                        subtitle="départements de France métropolitaine"
                        info="Soit tous les départements concernés par le phénomène de squats ou bidonvilles."
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
                    Nombre d'utilisateurs depuis
                    {{ numberOfNewUsersPerMonth[0].month.toLowerCase() }}
                </h2>
                <div class="chartWrapper">
                    <LineChart
                        :chartData="usersEvolutionData"
                        :options="{ maintainAspectRatio: false }"
                        height="250px"
                    />
                </div>
            </div>

            <div class="mt-32">
                <h2 class="text-display-lg text-secondary mb-4">
                    Nombre d'utilisateurs par semaine
                </h2>
                <div>
                    <iframe
                        id="widgetIframe"
                        width="100%"
                        height="260"
                        src="https://stats.data.gouv.fr/index.php?module=Widgetize&action=iframe&forceView=1&viewDataTable=graphEvolution&disableLink=0&widget=1&moduleToWidgetize=VisitsSummary&actionToWidgetize=getEvolutionGraph&idSite=86&period=week&date=yesterday&disableLink=1&widget=1&segment=pageUrl%3D@https%25253A%25252F%25252Fresorption-bidonvilles.beta.gouv.fr%25252F%252523%25252Fcartographie"
                        scrolling="yes"
                        frameborder="0"
                        marginheight="0"
                        marginwidth="0"
                    ></iframe>
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
                        info="En moyenne, depuis le 01/09/2019."
                    />
                    <StatsBlock
                        :title="meanTimeBeforeClosingDeclaration"
                        subtitle="jours entre la fermeture du site et sa déclaration"
                        info="En moyenne, depuis le 01/09/2019."
                    />
                    <StatsBlock
                        :title="numberOfShantytownOperations"
                        subtitle="bidonvilles ou squats mis à jour"
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
            stats: null
        };
    },
    created() {
        this.load();
    },

    computed: {
        numberOfDepartements() {
            return this.stats ? this.stats.numberOfDepartements : "...";
        },

        numberOfCollaboratorAndAssociationUsers() {
            return this.stats
                ? this.stats.numberOfCollaboratorAndAssociationUsers
                : "...";
        },

        numberOfTerritorialCollectivities() {
            return this.stats
                ? this.stats.numberOfCollaboratorAndAssociationOrganizations
                      .territorial_collectivity || 0
                : "...";
        },

        numberOfAssociations() {
            return this.stats
                ? this.stats.numberOfCollaboratorAndAssociationOrganizations
                      .association || 0
                : "...";
        },

        numberOfPublicEstablishments() {
            return this.stats
                ? this.stats.numberOfCollaboratorAndAssociationOrganizations
                      .public_establishment || 0
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
            if (this.numberOfNewUsersPerMonth === null) {
                return [];
            }

            const cumulativeData = this.numberOfNewUsersPerMonth.reduce(
                (acc, { total }, index) =>
                    index === 0
                        ? [parseInt(total, 10)]
                        : [...acc, parseInt(total, 10) + acc[acc.length - 1]],
                []
            );

            return {
                labels: this.numberOfNewUsersPerMonth.map(({ month }) => month),
                datasets: [
                    {
                        backgroundColor: ["#000091"],
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
                    "associations"
                ],
                datasets: [
                    {
                        backgroundColor: ["#000091", "#00AC8C", "#FF6F4C"],
                        data: [
                            this.numberOfPublicEstablishments,
                            this.numberOfTerritorialCollectivities,
                            this.numberOfAssociations
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
