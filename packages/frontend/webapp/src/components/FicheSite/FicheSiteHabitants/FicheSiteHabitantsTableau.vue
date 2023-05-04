<template>
    <table class="table-fixed text-center">
        <thead>
            <tr>
                <!-- icon -->
                <td></td>
                <!-- label -->
                <td class="border-b-1"></td>
                <!-- data (une colonne par date) -->
                <td
                    v-for="(col, colIndex) in populationHistory"
                    :key="colIndex"
                    class="w-24 py-2 border-b-1"
                    :class="{
                        'font-bold': colIndex === 0,
                        'bg-blue200': colIndex === 0,
                    }"
                >
                    {{ col.date }}<br />{{ col.year }}
                </td>
            </tr>
        </thead>

        <tbody>
            <tr
                v-for="(section, index) in sections"
                :key="index"
                :class="section.css"
            >
                <!-- icon -->
                <td class="align-top pr-2 text-xl">
                    <span v-if="section.icon === 'people'">
                        <Icon icon="male" class="mr-1" />
                        <Icon icon="male" />
                    </span>
                    <span v-else-if="section.icon === 'housing'">
                        <Icon icon="home" />
                    </span>
                </td>
                <!-- label -->
                <td
                    class="text-left pr-4 border-b-1"
                    :class="{
                        'border-black': sections[index + 1]?.icon !== undefined,
                    }"
                >
                    {{ section.title }}
                </td>
                <!-- data (une colonne par date) -->
                <td
                    v-for="(col, colIndex) in populationHistory"
                    :key="colIndex"
                    class="py-1 border-b-1"
                    :class="{
                        'border-r': colIndex > 0,
                        'border-b border-b-black':
                            sections[index + 1]?.icon !== undefined,
                        'bg-blue100': colIndex === 0,
                    }"
                >
                    {{ col[section.data] }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
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
    },
    {
        title: "Ménages",
        css: "font-bold",
        data: "populationCouples",
    },
    { title: "Mineurs", data: "populationMinors" },
    { title: "0 - 3 ans", data: "populationMinors0To3" },
    { title: "3 - 6 ans", data: "populationMinors3To6" },
    { title: "6 - 12 ans", data: "populationMinors6To12" },
    { title: "12 - 16 ans", data: "populationMinors12To16" },
    { title: "16 - 18 ans", data: "populationMinors16To18" },
    {
        title: "Inscrits en établissement scolaire",
        data: "minorsInSchool",
    },
    {
        title: "Caravanes",
        data: "caravans",
        icon: "housing",
    },
    {
        title: "Habitats autoconstruits",
        data: "huts",
    },
    {
        title: "Tentes",
        data: "tents",
    },
    {
        title: "Voitures dortoir",
        data: "cars",
    },
    {
        title: "Matelas",
        data: "mattresses",
    },
];

const populationHistory = computed(() => {
    let ref = {
        populationTotal: formatInt(town.value.populationTotal, "-"),
        populationCouples: formatInt(town.value.populationCouples, "-"),
        populationMinors: formatInt(town.value.populationMinors, "-"),
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

    // on traite le changelog pour n'y conserver que les étapes qui contiennent au moins un
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
        .filter(({ diff }) => {
            return diff.length > 0;
        });

    // s'il n'y a jamais eu de changement sur les champs de population, on a une seule entrée dans
    // l'historique, à savoir les valeurs présentes, à la date de déclaration du site sur la
    // plateforme
    if (entries.length === 0) {
        return [
            {
                ...ref,
                date: formatDate(town.value.createdAt, "d B"),
                year: formatDate(town.value.createdAt, "y"),
            },
        ];
    }

    // s'il y a eu au moins une modification
    return [
        // la première entrée dans l'historique correspond aux valeurs présentes
        // à la date de dernière modification
        {
            ...ref,
            date: formatDate(entries[0].date, "d B"),
            year: formatDate(entries[0].date, "y"),
        },

        // puis on ajoute une entrée dans l'historique pour chaque entrée dans le changelog
        ...entries.map(({ diff }, index) => {
            // on reconstitue l'état "old" à ajouter dans l'historique
            diff.forEach(({ fieldKey, oldValue }) => {
                ref[fieldKey] = oldValue === "non renseigné" ? "-" : oldValue;
            });

            // la date associée à cet état "old" est soit la date de l'entrée suivante dans le changelog s'il y en a une, soit la date de déclaration du site
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
            };
        }),
    ];
});
</script>
