<template>
    <table class="table-fixed text-center">
        <caption class="mb-4">
            Récapitulatif des habitants et des habitats sur le site
            <span class="sr-only">
                Les caractéristiques des habitants et des habitats sont
                présentées par ligne. Chaque colonne correspond à une date de
                saisie.
            </span>
        </caption>
        <thead>
            <tr>
                <!-- icon -->
                <th></th>
                <!-- label -->
                <th class="border-b-1"></th>
                <!-- data (une colonne par date) -->
                <th
                    v-for="(col, colIndex) in populationHistory"
                    :key="colIndex"
                    class="w-24 py-2 border-b-1 font-normal"
                    :class="{
                        'font-bold': colIndex === 0,
                        'bg-blue200': colIndex === 0,
                        'bg-sky-200': closestEntryDate === col.fullDate,
                    }"
                >
                    {{ col.date }}<br />{{ col.year }}
                </th>
            </tr>
        </thead>

        <tbody>
            <tr
                v-for="(section, index) in sections"
                :key="index"
                :class="section.css"
            >
                <!-- icon -->
                <th
                    rowspan="11"
                    v-if="section.icon === 'people'"
                    class="align-top pr-2 text-xl"
                    id="section_people"
                >
                    <span>
                        <Icon icon="male" class="mr-1" />
                        <Icon icon="male" />
                        <span class="sr-only">Type de personne</span>
                    </span>
                </th>
                <th
                    rowspan="5"
                    v-else-if="section.icon === 'housing'"
                    class="align-top pr-2 text-xl"
                    id="section_housing"
                >
                    <span>
                        <Icon icon="home" />
                    </span>
                    <span class="sr-only">Type d'habitat</span>
                </th>
                <!-- label -->
                <th
                    class="text-left pr-4 border-b-1"
                    :class="{
                        'border-black': sections[index + 1]?.icon !== undefined,
                        [section.css]: section.css !== undefined,
                    }"
                    :id="'raw_' + section.data"
                    :headers="'section_' + section.section"
                >
                    {{ section.title }}
                </th>
                <!-- data (une colonne par date) -->
                <td
                    v-for="(col, colIndex) in populationHistory"
                    :key="colIndex"
                    class="py-1 border-b-1"
                    :headers="
                        ' section_' + section.section + ' raw_' + section.data
                    "
                    :class="{
                        'border-r': colIndex > 0,
                        'border-b border-b-black':
                            sections[index + 1]?.icon !== undefined,
                        'bg-blue100': colIndex === 0,
                        'bg-sky-200': closestEntryDate === col.fullDate,
                    }"
                >
                    {{ col[section.data] }}
                </td>
            </tr>
        </tbody>
    </table>
    <div class="flex mt-2 gap-2" v-if="closestEntryDate">
        <div class="relative w-5 h-5 bg-sky-200"></div>
        Recensement de la population au démarrage de la résorption
    </div>
</template>

<script setup>
import { ref, defineProps, toRefs, computed, watch } from "vue";
import formatInt from "@/utils/formatInt";
import formatDate from "@common/utils/formatDate.js";

import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const sections = [
    {
        title: "Personnes",
        css: "font-bold",
        data: "populationTotal",
        icon: "people",
        section: "people",
    },
    {
        title: "dont femmes et filles",
        css: "font-normal pl-14",
        data: "populationTotalFemales",
        section: "people",
    },
    {
        title: "Ménages",
        css: "font-bold",
        data: "populationCouples",
        section: "people",
    },
    {
        title: "Mineurs",
        css: "font-bold",
        data: "populationMinors",
        section: "people",
    },
    {
        title: "dont filles",
        css: "font-normal pl-14",
        data: "populationMinorsGirls",
        section: "people",
    },
    {
        title: "0 - 3 ans",
        css: "font-bold",
        data: "populationMinors0To3",
        section: "people",
    },
    {
        title: "3 - 6 ans",
        css: "font-bold",
        data: "populationMinors3To6",
        section: "people",
    },
    {
        title: "6 - 12 ans",
        css: "font-bold",
        data: "populationMinors6To12",
        section: "people",
    },
    {
        title: "12 - 16 ans",
        css: "font-bold",
        data: "populationMinors12To16",
        section: "people",
    },
    {
        title: "16 - 18 ans",
        css: "font-bold",
        data: "populationMinors16To18",
        section: "people",
    },
    {
        title: "Inscrits en établissement scolaire",
        css: "font-bold",
        data: "minorsInSchool",
        section: "people",
    },
    {
        title: "Caravanes",
        data: "caravans",
        icon: "housing",
        section: "housing",
    },
    {
        title: "Habitats autoconstruits",
        data: "huts",
        section: "housing",
    },
    {
        title: "Tentes",
        data: "tents",
        section: "housing",
    },
    {
        title: "Voitures dortoir",
        data: "cars",
        section: "housing",
    },
    {
        title: "Matelas",
        data: "mattresses",
        section: "housing",
    },
];
const closestEntryDate = ref(null);

watch(
    () => town.value?.preparatoryPhasesTowardResorption,
    (phases) => {
        if (!phases?.length) {
            return;
        }

        const officialOpeningDate = phases.find(
            (phase) => phase.preparatoryPhaseId === "official_opening"
        )?.completedAt;

        if (officialOpeningDate) {
            const entriesAfterOpening = town.value.changelog.filter(
                (entry) =>
                    new Date(entry.date * 1000).setHours(0, 0, 0, 0) >=
                    new Date(officialOpeningDate * 1000).setHours(0, 0, 0, 0)
            );

            if (entriesAfterOpening.length > 0) {
                closestEntryDate.value =
                    entriesAfterOpening[entriesAfterOpening.length - 1].date *
                    1000;
            }
        }
    },
    { immediate: true }
);

const populationHistory = computed(() => {
    let ref = {
        populationTotal: formatInt(town.value.populationTotal, "-"),
        populationTotalFemales: formatInt(
            town.value.populationTotalFemales,
            "-"
        ),
        populationCouples: formatInt(town.value.populationCouples, "-"),
        populationMinors: formatInt(town.value.populationMinors, "-"),
        populationMinorsGirls: formatInt(town.value.populationMinorsGirls, "-"),
        populationMinors0To3: formatInt(town.value.populationMinors0To3, "-"),
        populationMinors3To6: formatInt(town.value.populationMinors3To6, "-"),
        populationMinors6To12: formatInt(town.value.populationMinors6To12, "-"),
        populationMinors12To16: formatInt(
            town.value.populationMinors12To16,
            "-"
        ),
        populationMinors16To18: formatInt(
            town.value.populationMinors16To18,
            "-"
        ),
        minorsInSchool: formatInt(town.value.minorsInSchool, "-"),
        caravans: formatInt(town.value.caravans, "-"),
        huts: formatInt(town.value.huts, "-"),
        tents: formatInt(town.value.tents, "-"),
        cars: formatInt(town.value.cars, "-"),
        mattresses: formatInt(town.value.mattresses, "-"),
    };

    // On traite le changelog pour n'y conserver que les étapes qui contiennent au moins un
    // changement sur les champs de population
    const entries = town.value.changelog
        .map((entry) => {
            return {
                ...entry,
                diff: entry.diff.filter(
                    ({ fieldKey }) =>
                        fieldKey.startsWith("population") ||
                        fieldKey === "minorsInSchool" ||
                        fieldKey === "caravans" ||
                        fieldKey === "huts" ||
                        fieldKey === "tents" ||
                        fieldKey === "cars" ||
                        fieldKey === "mattresses"
                ),
            };
        })
        .filter(({ diff }) => diff.length > 0);

    // S'il n'y a jamais eu de changement sur les champs de population, on a une seule entrée dans
    // l'historique, à savoir les valeurs présentes, à la date de déclaration du site sur la
    // plateforme
    if (entries.length === 0) {
        return [
            {
                ...ref,
                date: formatDate(town.value.createdAt, "d B"),
                year: formatDate(town.value.createdAt, "y"),
                fullDate: new Date(town.value.createdAt).setHours(0, 0, 0, 0),
            },
        ];
    }

    // S'il y a eu au moins une modification
    return [
        // La première entrée dans l'historique correspond aux valeurs présentes
        // à la date de dernière modification
        {
            ...ref,
            date: formatDate(entries[0].date, "d B"),
            year: formatDate(entries[0].date, "y"),
            fullDate: entries[0].date * 1000,
        },

        // Puis on ajoute une entrée dans l'historique pour chaque entrée dans le changelog
        ...entries.map(({ diff }, index) => {
            // On reconstitue l'état "old" à ajouter dans l'historique
            diff.forEach(({ fieldKey, oldValue }) => {
                ref[fieldKey] = oldValue === "non renseigné" ? "-" : oldValue;
            });

            // La date associée à cet état "old" est soit la date de l'entrée suivante dans le changelog
            // s'il y en a une, soit la date de déclaration du site
            let date;
            if (index < entries.length - 1) {
                ({ date } = entries[index + 1]);
            } else {
                date = town.value.createdAt;
            }

            return {
                ...ref,
                date: formatDate(date, "d B"),
                year: formatDate(date, "y"),
                fullDate: date * 1000,
            };
        }),
    ];
});
</script>
