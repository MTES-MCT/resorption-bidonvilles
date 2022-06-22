<template>
    <DetailsPanel>
        <template v-slot:title>Habitants</template>
        <template v-slot:body>
            <DetailsPanelSection>
                <div class="italic mb-4">
                    Le nombre de personnes sur un site est mouvant, les données
                    fournies par les acteurs, même des estimations, participent
                    à l'amélioration de la connaissance.
                </div>

                <div class="overflow-x-auto max-w-4xl mb-6">
                    <table class="table-fixed text-center">
                        <thead>
                            <tr>
                                <td></td>
                                <td class="border-b-1"></td>
                                <td
                                    v-for="(col, colIndex) in populationHistory"
                                    class="w-24 py-2 border-b-1"
                                    v-bind:class="{
                                        'font-bold': colIndex === 0,
                                        'bg-gray-200': colIndex === 0
                                    }"
                                    v-bind:key="colIndex"
                                >
                                    {{ col.date }}<br />{{ col.year }}
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="(section, index) in sections"
                                :class="section.css"
                                v-bind:key="index"
                            >
                                <td
                                    v-if="index === 0"
                                    class="align-top pr-2 text-xl"
                                    :rowspan="sections.length"
                                >
                                    <Icon icon="male" class="mr-1"></Icon>
                                    <Icon icon="male"></Icon>
                                </td>
                                <td class="text-left pr-4 border-b-1">
                                    {{ section.title }}
                                </td>
                                <td
                                    v-for="(col, colIndex) in populationHistory"
                                    class="py-1 border-b-1"
                                    v-bind:class="{
                                        'border-r-1':
                                            colIndex > 0 ||
                                            populationHistory.length <= 1,
                                        'bg-gray-100': colIndex === 0
                                    }"
                                    v-bind:key="colIndex"
                                    :data-cy-data="
                                        colIndex === 0
                                            ? section.data
                                            : undefined
                                    "
                                >
                                    {{ col[section.data] }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <div class="font-bold">Origine</div>
                    <div data-cy-data="social_origins">
                        <div
                            v-if="!town.socialOrigins.length"
                            class="text-G600"
                        >
                            inconnu
                        </div>
                        <div
                            class="flex items-center"
                            v-else
                            v-for="origin in town.socialOrigins"
                            :key="origin.id"
                        >
                            <img
                                :src="socialOrigin(origin).img"
                                class=" w-8 mr-2"
                            />
                            <span class="text-display-sm font-bold">{{
                                socialOrigin(origin).label
                            }}</span>
                        </div>
                    </div>
                </div>
            </DetailsPanelSection>
            <DetailsPanelSection>
                <div class="flex items-center justify-between">
                    <div class="w-96">
                        <div class="font-bold">Diagnostic social</div>
                        <div data-cy-data="census_status">
                            {{ socialDiagnostic }}
                        </div>
                    </div>
                    <div class="italic">
                        Un diagnostic social vise à identifier les situations et
                        besoins des familles et personnes, de repérer le
                        contexte territorial et les acteurs en présence.
                    </div>
                </div>
            </DetailsPanelSection>
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import DetailsPanelSection from "#app/components/ui/details/DetailsPanelSection.vue";
import flagFR from "#app/pages/TownsList/assets/fr.png";
import flagEU from "#app/pages/TownsList/assets/eu.png";
import flagExtraCommunautaires from "#app/pages/TownsList/assets/extra-communautaires.png";

export default {
    props: {
        town: {
            type: Object
        }
    },
    data() {
        return {
            sections: [
                {
                    title: "Personnes",
                    css: "font-bold",
                    data: "populationTotal"
                },
                {
                    title: "Ménages",
                    css: "font-bold",
                    data: "populationCouples"
                },
                { title: "Mineurs", data: "populationMinors" },
                { title: "0 - 3 ans", data: "populationMinors0To3" },
                { title: "3 - 6 ans", data: "populationMinors3To6" },
                { title: "6 - 12 ans", data: "populationMinors6To12" },
                { title: "12 - 16 ans", data: "populationMinors12To16" },
                { title: "16 - 18 ans", data: "populationMinors16To18" },
                {
                    title: "Inscrits en établissement scolaire",
                    data: "minorsInSchool"
                },
                {
                    title: "Caravanes",
                    data: "caravans"
                },
                {
                    title: "Cabanes",
                    data: "huts"
                }
            ]
        };
    },
    components: { DetailsPanel, DetailsPanelSection },
    mounted() {
        console.log(this.populationHistory);
    },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        },
        socialOrigin(origin) {
            if (origin.id === 1) {
                return { id: 1, label: "Français", img: flagFR };
            }

            if (origin.id === 2) {
                return { id: 2, label: "Union européenne", img: flagEU };
            }

            if (origin.id === 3) {
                return {
                    id: 3,
                    label: "Hors Union européenne",
                    img: flagExtraCommunautaires
                };
            }

            return origin;
        },
        intToStr(int, nullValue = "NC") {
            if (int === undefined || int === null) {
                return nullValue;
            }

            return int;
        }
    },
    computed: {
        populationHistory() {
            // valeurs présentes
            let ref = {
                populationTotal: this.intToStr(this.town.populationTotal, "-"),
                populationCouples: this.intToStr(
                    this.town.populationCouples,
                    "-"
                ),
                populationMinors: this.intToStr(
                    this.town.populationMinors,
                    "-"
                ),
                populationMinors0To3: this.intToStr(
                    this.town.populationMinors0To3,
                    "-"
                ),
                populationMinors3To6: this.intToStr(
                    this.town.populationMinors3To6,
                    "-"
                ),
                populationMinors6To12: this.intToStr(
                    this.town.populationMinors6To12,
                    "-"
                ),
                populationMinors12To16: this.intToStr(
                    this.town.populationMinors12To16,
                    "-"
                ),
                populationMinors16To18: this.intToStr(
                    this.town.populationMinors16To18,
                    "-"
                ),
                minorsInSchool: this.intToStr(this.town.minorsInSchool, "-"),
                caravans: this.intToStr(this.town.caravans, "-"),
                huts: this.intToStr(this.town.huts, "-")
            };

            // on traite le changelog pour n'y conserver que les étapes qui contiennent au moins un changement sur les champs de population
            const entries = this.town.changelog
                .map(entry => {
                    return {
                        ...entry,
                        diff: entry.diff.filter(
                            ({ fieldKey }) =>
                                fieldKey.startsWith("population") ||
                                fieldKey === "minorsInSchool" ||
                                fieldKey === "caravans" ||
                                fieldKey === "huts"
                        )
                    };
                })
                .filter(({ diff }) => {
                    return diff.length > 0;
                });

            // s'il n'y a jamais eu de changement sur les champs de population, on a une seule entrée dans l'historique, à savoir les valeurs présentes, à la date de déclaration du site sur la plateforme
            if (entries.length === 0) {
                return [
                    {
                        ...ref,
                        date: this.formatDate(this.town.createdAt, "d B"),
                        year: this.formatDate(this.town.createdAt, "y")
                    }
                ];
            }

            // s'il y a eu au moins une modification
            return [
                // la première entrée dans l'historique correspond aux valeurs présentes, à la date de dernière modification
                {
                    ...ref,
                    date: this.formatDate(entries[0].date, "d B"),
                    year: this.formatDate(entries[0].date, "y")
                },

                // puis on ajoute une entrée dans l'historique pour chaque entrée dans le changelog
                ...entries.map(({ diff }, index) => {
                    // on reconstitue l'état "old" à ajouter dans l'historique
                    diff.forEach(({ fieldKey, oldValue }) => {
                        ref[fieldKey] =
                            oldValue === "non renseigné" ? "-" : oldValue;
                    });

                    // la date associée à cet état "old" est soit la date de l'entrée suivante dans le changelog s'il y en a une, soit la date de déclaration du site
                    let date;
                    if (index < entries.length - 1) {
                        ({ date } = entries[index + 1]);
                    } else {
                        date = this.town.createdAt;
                    }

                    return {
                        ...ref,
                        date: this.formatDate(date, "d B"),
                        year: this.formatDate(date, "y")
                    };
                })
            ];
        },
        socialDiagnostic() {
            if (this.town.censusStatus === "done") {
                return `Réalisé le ${this.formatDate(
                    this.town.censusConductedAt,
                    "d/m/y"
                )} par ${this.town.censusConductedBy}`;
            }

            if (this.town.censusStatus === "scheduled") {
                return `Prévu le ${this.formatDate(
                    this.town.censusConductedAt,
                    "d/m/y"
                )} par ${this.town.censusConductedBy}`;
            }

            if (this.town.censusStatus === "none") {
                return "Non réalisé";
            }

            return "Non communiqué";
        },
        populationMinors0To3() {
            return this.intToStr(this.town.populationMinors0To3);
        },
        populationMinors3To6() {
            return this.intToStr(this.town.populationMinors3To6);
        },
        populationMinors6To12() {
            return this.intToStr(this.town.populationMinors6To12);
        },
        populationMinors12To16() {
            return this.intToStr(this.town.populationMinors12To16);
        },
        populationMinors16To18() {
            return this.intToStr(this.town.populationMinors16To18);
        },
        minorsInSchool() {
            return this.intToStr(this.town.minorsInSchool);
        }
    }
};
</script>
