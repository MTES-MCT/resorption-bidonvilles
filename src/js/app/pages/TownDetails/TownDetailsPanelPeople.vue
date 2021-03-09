<template>
    <TownDetailsPanel>
        <template v-slot:title>Habitants</template>
        <template v-slot:body>
            <TownDetailsPanelSection>
                <div class="italic mb-4">
                    Le nombre de personnes sur un site est mouvant, les données
                    fournies par les acteurs, même des estimations, participent
                    à l'amélioration de la connaissance.
                </div>

                <table class="table-fixed text-center mb-6">
                    <thead>
                        <tr>
                            <td></td>
                            <td class="border-b"></td>
                            <td
                                v-for="(col, colIndex) in populationHistory"
                                class="w-24 py-2 border-b"
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
                            <td class="text-left pr-4 border-b">
                                {{ section.title }}
                            </td>
                            <td
                                v-for="(col, colIndex) in populationHistory"
                                class="py-1 border-b"
                                v-bind:class="{
                                    'border-r':
                                        colIndex > 0 ||
                                        populationHistory.length <= 1,
                                    'bg-gray-100': colIndex === 0
                                }"
                                v-bind:key="colIndex"
                                :data-cy-data="
                                    colIndex === 0 ? section.data : undefined
                                "
                            >
                                {{ col[section.data] }}
                            </td>
                        </tr>
                    </tbody>
                </table>

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
                            <span class="text-display-sm">{{
                                socialOrigin(origin).label
                            }}</span>
                        </div>
                    </div>
                </div>
            </TownDetailsPanelSection>
            <TownDetailsPanelSection>
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
            </TownDetailsPanelSection>
        </template>
    </TownDetailsPanel>
</template>

<script>
import TownDetailsPanel from "./ui/TownDetailsPanel.vue";
import TownDetailsPanelSection from "./ui/TownDetailsPanelSection.vue";
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
                }
            ]
        };
    },
    components: { TownDetailsPanel, TownDetailsPanelSection },
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
            const present = {
                date: this.formatDate(this.town.updatedAt, "d B"),
                year: this.formatDate(this.town.updatedAt, "y"),
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
                minorsInSchool: this.intToStr(this.town.minorsInSchool, "-")
            };

            let ref = { ...present };
            const past = this.town.changelog.reduce((acc, log, index) => {
                const diff = log.diff.filter(
                    ({ fieldKey }) =>
                        fieldKey.startsWith("population") ||
                        fieldKey === "minorsInSchool"
                );
                if (diff.length === 0) {
                    return acc;
                }

                let date;
                if (index < this.town.changelog.length - 1) {
                    date = this.town.changelog[index + 1].date;
                } else {
                    date = this.town.createdAt;
                }

                ref.date = this.formatDate(date, "d B");
                ref.year = this.formatDate(date, "y");
                diff.forEach(({ fieldKey, oldValue }) => {
                    ref[fieldKey] =
                        oldValue === "non renseigné" ? "-" : oldValue;
                });

                return [...acc, { ...ref }];
            }, []);

            return [present, ...past];
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
