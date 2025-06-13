<template>
    <section>
        <ContentWrapper>
            <div>
                <h1 class="text-display-xl font-bold">Impacts</h1>
            </div>
            <div class="flex flex-col gap-2 mt-4 mb-16">
                <p>
                    Plus de
                    <strong class="text-xl text-secondary">90</strong>
                    sites résorbés et
                    <strong class="text-xl text-secondary">6&nbsp;500</strong>
                    personnes relogées entre 2019 et 2023.
                </p>
                <p>
                    <strong class="text-xl text-secondary">55&nbsp;%</strong>
                    des personnes vivant en bidonvilles ont accès à l’eau en
                    2023, contre 37&nbsp;% en 2020.
                </p>
                <p>
                    <strong class="text-xl text-secondary">45&nbsp;%</strong>
                    des utilisateurs affirment gagner du temps dans leur travail
                    grâce à la plateforme.
                </p>
            </div>
            <div>
                <h1 class="text-display-xl font-bold">Statistiques</h1>
                <div>
                    Depuis l'ouverture nationale de la plateforme en juin 2019.
                </div>
            </div>

            <h2 class="text-display-lg font-bold text-secondary mt-16">
                Répartition des utilisateurs
            </h2>
            <div class="grid grid-cols-1 xl:grid-cols-2 mt-4 gap-4">
                <div
                    class="flex justify-center content-center"
                    :class="{
                        'grid animate-pulse bg-gray-300 rounded-lg h-32':
                            numberOfPublicEstablishmentUsers === '...',
                    }"
                >
                    <RepartitionUtilisateurs
                        v-if="numberOfPublicEstablishmentUsers !== '...'"
                        :data="organizationRepartitionData"
                    />
                    <span class="text-display-lg font-bold" v-else
                        ><Spinner
                    /></span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <StatsBlock
                            v-if="
                                numberOfTerritorialCollectivitieUsers !== '...'
                            "
                            :title="numberOfDepartements"
                            icon="flag"
                            subtitle="départements"
                        />
                        <span
                            class="flex justify-center content-center text-display-lg font-bold grid animate-pulse bg-gray-300 rounded-lg h-32"
                            v-else
                            ><Spinner
                        /></span>
                    </div>
                    <div>
                        <StatsBlock
                            v-if="numberOfNewUsers.total !== '...'"
                            :title="numberOfNewUsers.total"
                            icon="user-plus"
                            :subtitle="
                                'nouveaux utilisateurs en ' +
                                numberOfNewUsers.month.toLowerCase()
                            "
                        />
                        <span
                            class="flex justify-center content-center text-display-lg font-bold grid animate-pulse bg-gray-300 rounded-lg h-32"
                            v-else
                            ><Spinner
                        /></span>
                    </div>
                </div>
            </div>

            <div>
                <h2 class="text-display-lg font-bold text-secondary mt-16 mb-4">
                    Nombre d'utilisateurs
                </h2>
                <div class="chartWrapper">
                    <NombreUtilisateurs
                        :data="usersEvolutionData"
                        v-if="numberOfNewUsersPerMonth !== null"
                        class="h-60 w-full"
                    />
                    <span
                        class="flex justify-center content-center text-display-lg font-bold grid animate-pulse bg-gray-300 rounded-lg h-32"
                        v-else
                        ><Spinner
                    /></span>
                </div>
            </div>

            <div class="mt-16">
                <h2 class="text-display-lg font-bold text-secondary mb-4">
                    Nombre d'utilisateurs par semaine
                </h2>
                <div class="chartWrapper">
                    <NombreUtilisateursParSemaine
                        :data="wauData"
                        v-if="wauData !== null"
                        class="h-60 w-full"
                    />
                    <span
                        class="flex justify-center content-center text-display-lg font-bold grid animate-pulse bg-gray-300 rounded-lg h-32"
                        v-else
                        ><Spinner
                    /></span>
                </div>
            </div>

            <StatsSection title="Usage" class="mt-16">
                <div>
                    <StatsBlock
                        v-if="numberOfExports !== '...'"
                        :title="numberOfExports"
                        icon="file-download"
                        subtitle="extractions de données réalisées"
                        info="Les exports Excel permettent aux acteurs locaux d'utiliser et d'analyser les données afin de suivre, communiquer et optimiser les actions de résorption depuis le 15/11/2019."
                    />
                    <span
                        class="flex justify-center content-center text-display-lg font-bold grid animate-pulse bg-gray-300 rounded-lg h-32"
                        v-else
                        ><Spinner
                    /></span>
                </div>
                <div>
                    <StatsBlock
                        v-if="numberOfComments !== '...'"
                        :title="numberOfComments"
                        icon="comment"
                        subtitle="commentaires créés"
                        info="Au delà du suivi des chiffrés, les commentaires permettent de suivre et de partager des informations qualitative utiles dans une action multi-partenariale."
                    />
                    <span
                        class="flex justify-center content-center text-display-lg font-bold grid animate-pulse bg-gray-300 rounded-lg h-32"
                        v-else
                        ><Spinner
                    /></span>
                </div>
                <div>
                    <StatsBlock
                        v-if="numberOfDirectoryViews !== '...'"
                        :title="numberOfDirectoryViews"
                        icon="address-book"
                        subtitle="fiches contact consultées"
                        info="L'annuaire permet d'accéder aux coordonnées de tous les utilisateurs de la plateforme. Son utilisation participe à la mise en réseau partenaires locaux ou des pairs depuis le 15/11/2019"
                    />
                    <span
                        class="flex justify-center content-center text-display-lg font-bold grid animate-pulse bg-gray-300 rounded-lg h-32"
                        v-else
                        ><Spinner
                    /></span>
                </div>
            </StatsSection>

            <StatsSection title="Fréquence de mise à jour" class="mt-16">
                <template v-slot:info
                    ><span class="text-secondary">
                        <Icon icon="sync" width="16" height="16" />
                    </span>
                    La mise à jour régulière des données garantissent des
                    informations justes à tous les acteurs.</template
                >
                <template v-slot:default>
                    <div>
                        <StatsBlock
                            v-if="medianTimeBeforeCreationDeclaration !== '...'"
                            :title="medianTimeBeforeCreationDeclaration"
                            subtitle="jours entre l'installation d'un bidonville ou squat et sa déclaration"
                            info="Médiane depuis le 01/09/2019."
                        />
                        <span
                            class="flex justify-center content-center text-display-lg font-bold grid animate-pulse bg-gray-300 rounded-lg h-32"
                            v-else
                            ><Spinner
                        /></span>
                    </div>
                    <div>
                        <StatsBlock
                            v-if="medianTimeBeforeClosingDeclaration !== '...'"
                            :title="medianTimeBeforeClosingDeclaration"
                            subtitle="jours entre la fermeture du site et sa déclaration"
                            info="Médiane depuis le 01/09/2019."
                        />
                        <span
                            class="flex justify-center content-center text-display-lg font-bold grid animate-pulse bg-gray-300 rounded-lg h-32"
                            v-else
                            ><Spinner
                        /></span>
                    </div>
                    <div>
                        <StatsBlock
                            v-if="numberOfShantytownOperations !== '...'"
                            :title="numberOfShantytownOperations"
                            subtitle="mises à jour de bidonvilles et squats"
                            info="Toutes opérations confondues : création, modification, fermeture"
                        />
                        <span
                            class="flex justify-center content-center text-display-lg font-bold grid animate-pulse bg-gray-300 rounded-lg h-32"
                            v-else
                            ><Spinner
                        /></span>
                    </div>
                </template>
            </StatsSection>
        </ContentWrapper>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ENV from "@/helpers/env.js";
import { ContentWrapper, Icon, Spinner } from "@resorptionbidonvilles/ui";
import StatsBlock from "./StatsBlock.vue";
import StatsSection from "./StatsSection.vue";
import RepartitionUtilisateurs from "./Graphs/RepartitionUtilisateurs.vue";
import NombreUtilisateurs from "./Graphs/NombreUtilisateurs.vue";
import NombreUtilisateursParSemaine from "./Graphs/NombreUtilisateursParSemaine.vue";

const { API_URL } = ENV;

const state = ref(null);
const stats = ref(null);

onMounted(load);

function load() {
    if (state.value === "loading") {
        return;
    }

    state.value = "loading";

    fetch(`${API_URL}/statistics`)
        .then((response) => response.json())
        .then((response) => {
            stats.value = response.statistics;
            stats.value.state = "loaded";
        });
}

const numberOfDepartements = computed(() => {
    return stats.value ? stats.value.numberOfDepartements : "...";
});

const numberOfTerritorialCollectivitieUsers = computed(() => {
    return stats.value
        ? stats.value.numberOfCollaboratorAndAssociationUsers
              .territorial_collectivity || 0
        : "...";
});

const numberOfAssociationUsers = computed(() => {
    return stats.value
        ? stats.value.numberOfCollaboratorAndAssociationUsers.association || 0
        : "...";
});

const numberOfPublicEstablishmentUsers = computed(() => {
    return stats.value
        ? stats.value.numberOfCollaboratorAndAssociationUsers
              .public_establishment || 0
        : "...";
});

const numberOfAdministrationUsers = computed(() => {
    return stats.value
        ? stats.value.numberOfCollaboratorAndAssociationUsers.administration ||
              0
        : "...";
});

const numberOfExports = computed(() => {
    return stats.value ? stats.value.numberOfExports : "...";
});

const numberOfComments = computed(() => {
    return stats.value ? stats.value.numberOfComments : "...";
});

const numberOfDirectoryViews = computed(() => {
    return stats.value ? stats.value.numberOfDirectoryViews : "...";
});

const numberOfNewUsersPerMonth = computed(() => {
    return (stats.value && stats.value.numberOfNewUsersPerMonth) || null;
});

const usersEvolutionData = computed(() => {
    if (
        numberOfNewUsersPerMonth.value === null ||
        stats.value.numberOfUsersOnJune2020 === null
    ) {
        return [];
    }

    const initialValue = parseInt(stats.value.numberOfUsersOnJune2020, 10);

    const cumulativeData = numberOfNewUsersPerMonth.value.reduce(
        (acc, { total }, index) =>
            index === 0
                ? [parseInt(total, 10) + initialValue]
                : [...acc, parseInt(total, 10) + acc[acc.length - 1]],
        []
    );

    return {
        labels: numberOfNewUsersPerMonth.value.map(({ month }) => month),
        datasets: [
            {
                label: "Nombre d'utilisateurs inscrits",
                data: cumulativeData,
                fill: true,
            },
            {
                label: "Nombre d'utilisateurs actifs",
                data: stats.value.numberOfActiveUsersPerMonth.map(
                    ({ total }) => total
                ),
                fill: true,
                borderColor: "#BFBFE3",
                backgroundColor: "#BFBFE3",
            },
        ],
    };
});

const organizationRepartitionData = computed(() => {
    return {
        labels: [
            "services de l'État",
            "collectivités territoriales",
            "associations",
            "administration",
        ],
        datasets: [
            {
                backgroundColor: ["#169B62", "#5770BE", "#FF8D7E", "#6A6A6A"],
                data: [
                    numberOfPublicEstablishmentUsers.value,
                    numberOfTerritorialCollectivitieUsers.value,
                    numberOfAssociationUsers.value,
                    numberOfAdministrationUsers.value,
                ],
                label: "utilisateurs institutionnels et associatifs",
            },
        ],
    };
});

const numberOfNewUsers = computed(() => {
    return stats.value && stats.value.numberOfNewUsersPerMonth
        ? stats.value.numberOfNewUsersPerMonth.slice(-1)[0]
        : { total: "...", month: "..." };
});

const medianTimeBeforeCreationDeclaration = computed(() => {
    return stats.value
        ? Math.round(stats.value.meanTimeBeforeCreationDeclaration.median) ||
              "?"
        : "...";
});

const medianTimeBeforeClosingDeclaration = computed(() => {
    return stats.value
        ? Math.round(stats.value.meanTimeBeforeClosingDeclaration.median) || "?"
        : "...";
});

const numberOfShantytownOperations = computed(() => {
    return stats.value ? stats.value.numberOfShantytownOperations : "...";
});

const wauData = computed(() => {
    if (!stats.value) {
        return null;
    }

    return {
        scales: {
            y: {
                min: 0,
            },
        },
        labels: stats.value.wau.map(({ monday }) => `Semaine du ${monday}`),
        datasets: [
            {
                backgroundColor: "#E5E5F4",
                data: stats.value.wau.map(({ wau }) => wau),
                label: "Nombre d'utilisateurs sur la semaine",
            },
        ],
    };
});
</script>

<style scoped>
.chartWrapper {
    max-height: 300px;
    position: relative;
}
</style>
