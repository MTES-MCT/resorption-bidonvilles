<template>
    <PublicLayout :stickyHeader="false">
        <PublicContainer class="py-16">
            <div>
                <h1 class="text-display-xl">Statistiques</h1>
                <div>
                    Depuis l'ouverture nationale de la plateforme en juin 2019
                </div>
            </div>

            <StatsSection class="mt-16" title="Utilisateurs">
                <StatsBlock
                    :title="numberOfDepartements"
                    icon="flag"
                    subtitle="départements de France métropolitaine"
                    info="Soit tous les départements concernés par le phénomène de squats ou bidonvilles."
                />
                <StatsBlock
                    :title="numberOfCollaboratorAndAssociationUsers"
                    icon="users"
                    subtitle="utilisateurs institutionnels et associatifs"
                    :info="
                        numberOfPublicEstablishments +
                            ' services de l\'État, ' +
                            numberOfTerritorialCollectivities +
                            ' collectivités territoriales, ' +
                            numberOfAssociations +
                            ' associations'
                    "
                />
                <StatsBlock
                    :title="numberOfNewUsers.total"
                    icon="user-plus"
                    :subtitle="
                        'nouveaux utilisateurs en ' +
                            numberOfNewUsers.month.toLowerCase()
                    "
                />
            </StatsSection>

            <div v-if="numberOfNewUsersPerMonth !== null">
                <h2 class="text-display-lg text-secondary mt-16">
                    Nombre d' utilisateurs depuis
                    {{ numberOfNewUsersPerMonth[0].month.toLowerCase() }}
                </h2>
                <TrendChart
                    class="stats-chart"
                    :datasets="usersEvolutionDatasets"
                    :labels="usersEvolutionLabels"
                    :grid="{ verticalLines: true, horizontalLines: true }"
                    :max="usersEvolutionMax"
                    :min="0"
                ></TrendChart>
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

export default {
    components: {
        PublicLayout,
        PublicContainer,
        StatsSection,
        StatsBlock
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

        usersEvolutionDatasets() {
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

            return [
                {
                    data: cumulativeData,
                    smooth: true,
                    fill: true
                }
            ];
        },

        usersEvolutionMax() {
            if (this.numberOfNewUsersPerMonth === null) {
                return 0;
            }

            const max = this.numberOfNewUsersPerMonth.reduce(
                (m, { total }) => Math.max(m, total),
                0
            );
            return Math.ceil(max / 10) * 10;
        },

        usersEvolutionLabels() {
            if (this.numberOfNewUsersPerMonth === null) {
                return {
                    xLabels: [],
                    yLabels: 10
                };
            }

            return {
                xLabels: this.numberOfNewUsersPerMonth.map(
                    ({ month }) => month
                ),
                yLabels: this.usersEvolutionMax / 10 + 1,
                yLabelsTextFormatter: val => val.toFixed(1)
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
