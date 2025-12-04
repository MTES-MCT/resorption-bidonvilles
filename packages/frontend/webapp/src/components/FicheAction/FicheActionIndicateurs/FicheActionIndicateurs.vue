<template>
    <FicheRubrique title="Indicateurs" id="indicateurs">
        <IndicateursGrid class="overflow-x-auto">
            <IndicateursRow>
                <template v-slot:right>
                    <div class="flex">
                        <IndicateursTableRowCell
                            v-for="date in data.dates"
                            :key="date"
                            class="text-center font-bold"
                            >{{
                                formatDate(date / 1000, "y")
                            }}</IndicateursTableRowCell
                        >
                    </div>
                </template>
            </IndicateursRow>

            <FicheActionIndicateursPersonnes :data="data.data.personnes" />

            <template v-if="sections.length > 0">
                <IndicateursRow>
                    <template v-slot:left>
                        <p class="mt-4 font-bold">Nombre ayant eu</p>
                    </template>
                    <template v-slot:right>
                        <div class="flex h-full">
                            <IndicateursTableRowCell
                                v-for="date in data.dates"
                                :key="date"
                            />
                        </div>
                    </template>
                </IndicateursRow>

                <template
                    v-for="(section, index) in sections"
                    :key="section.key"
                >
                    <IndicateursRow
                        v-if="
                            index > 0 &&
                            section.topic !== sections[index - 1].topic
                        "
                    >
                        <template v-slot:left>&nbsp;</template>
                        <template v-slot:right>
                            <div class="flex h-full">
                                <IndicateursTableRowCell
                                    v-for="date in data.dates"
                                    :key="date"
                                />
                            </div>
                        </template>
                    </IndicateursRow>

                    <component
                        :is="section.component"
                        :data="data.data[section.key]"
                    />
                </template>
            </template>
        </IndicateursGrid>

        <IndicateursGrid
            class="mt-10 overflow-x-auto"
            v-if="topicUids.includes('school')"
        >
            <IndicateursRow>
                <template v-slot:right>
                    <div class="flex">
                        <IndicateursTableRowCell
                            v-for="date in data.dates"
                            :key="date"
                            class="text-center font-bold"
                            >Année scolaire
                            {{ parseInt(formatDate(date / 1000, "y"), 10) - 1 }}
                            -
                            {{
                                formatDate(date / 1000, "y")
                            }}</IndicateursTableRowCell
                        >
                    </div>
                </template>
            </IndicateursRow>

            <FicheActionIndicateursScolaires :data="data.data.ecole" />
        </IndicateursGrid>
    </FicheRubrique>
</template>

<script setup>
import { toRefs, computed } from "vue";
import formatDate from "@common/utils/formatDate";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import IndicateursGrid from "@/components/IndicateursGrid/IndicateursGrid.vue";
import IndicateursRow from "@/components/IndicateursTable/IndicateursRow.vue";
import IndicateursTableRowCell from "@/components/IndicateursTable/IndicateursTableRowCell.vue";
import FicheActionIndicateursPersonnes from "./FicheActionIndicateursPersonnes.vue";
import FicheActionIndicateursSante from "./FicheActionIndicateursSante.vue";
import FicheActionIndicateursTravail from "./FicheActionIndicateursTravail.vue";
import FicheActionIndicateursHebergement from "./FicheActionIndicateursHebergement.vue";
import FicheActionIndicateursLogement from "./FicheActionIndicateursLogement.vue";
import FicheActionIndicateursScolaires from "./FicheActionIndicateursScolaires.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);

const sectionList = [
    { key: "sante", topic: "health", component: FicheActionIndicateursSante },
    { key: "travail", topic: "work", component: FicheActionIndicateursTravail },
    {
        key: "hebergement",
        topic: "housing",
        component: FicheActionIndicateursHebergement,
    },
    {
        key: "logement",
        topic: "housing",
        component: FicheActionIndicateursLogement,
    },
];
const topicUids = computed(() => {
    return action.value.topics.map(({ uid }) => uid);
});
const sections = sectionList.filter(({ topic }) =>
    topicUids.value.includes(topic)
);

const data = action.value.metrics.reduce(
    (acc, metrics) => {
        acc.dates.push(metrics.date);

        acc.data.personnes.push([
            metrics.nombre_personnes,
            metrics.nombre_menages,
            metrics.nombre_femmes,
            metrics.nombre_mineurs,
        ]);

        if (topicUids.value.includes("health")) {
            acc.data.sante.push([metrics.sante_nombre_personnes]);
        }

        if (topicUids.value.includes("work")) {
            acc.data.travail.push([
                metrics.travail_nombre_personnes,
                metrics.travail_nombre_femmes,
            ]);
        }

        if (topicUids.value.includes("housing")) {
            acc.data.hebergement.push([
                metrics.hebergement_nombre_personnes,
                metrics.hebergement_nombre_menages,
            ]);
            acc.data.logement.push([
                metrics.logement_nombre_personnes,
                metrics.logement_nombre_menages,
            ]);
        }

        if (topicUids.value.includes("school")) {
            acc.data.ecole.mineurs_identifies.push([
                metrics.scolaire_mineurs_moins_de_trois_ans,
                metrics.scolaire_mineurs_trois_ans_et_plus,
            ]);
            acc.data.ecole.mineurs_mediation.push([
                metrics.scolaire_mediation_moins_de_trois_ans,
                metrics.scolaire_mediation_trois_ans_et_plus,
            ]);

            const totalScolarises =
                (metrics.scolaire_nombre_maternelle || 0) +
                (metrics.scolaire_nombre_elementaire || 0) +
                (metrics.scolaire_nombre_college || 0) +
                (metrics.scolaire_nombre_lycee || 0);

            acc.data.ecole.scolarises.push([
                totalScolarises || null,
                metrics.scolaire_nombre_maternelle,
                metrics.scolaire_nombre_elementaire,
                metrics.scolaire_nombre_college,
                metrics.scolaire_nombre_lycee,
            ]);

            acc.data.ecole.autre.push([metrics.scolaire_nombre_autre]);
            acc.data.ecole.scolarises_dans_annee.push([
                metrics.scolaire_mineur_scolarise_dans_annee,
            ]);
        }

        return acc;
    },
    {
        dates: [],
        data: {
            personnes: [],
            sante: [],
            travail: [],
            hebergement: [],
            logement: [],
            ecole: {
                mineurs_identifies: [],
                mineurs_mediation: [],
                scolarises: [],
                autre: [],
                scolarises_dans_annee: [],
            },
        },
    }
);
</script>
