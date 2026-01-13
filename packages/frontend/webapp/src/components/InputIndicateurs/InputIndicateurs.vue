<template>
    <div>
        <div class="flex justify-between items-center">
            <Button
                icon="arrow-left"
                iconPosition="left"
                type="button"
                :disabled="focusedYear <= minYear"
                @click="previousYear"
                >Année précédente</Button
            >
            <Button
                icon="arrow-right"
                type="button"
                :disabled="focusedYear >= maxYear"
                @click="nextYear"
                >Année suivante</Button
            >
        </div>

        <IndicateursGrid class="mt-4">
            <IndicateursRow>
                <template v-slot:right>
                    <p class="px-4 pb-2">
                        <span class="font-bold"
                            >Résultats pour l'année {{ focusedYear }}</span
                        >
                    </p>
                </template>
            </IndicateursRow>

            <InputIndicateursPersonnes
                :data="focusedYearData"
                :errors="focusedYearErrors"
            />

            <template v-if="sections.length > 0">
                <IndicateursRow>
                    <template v-slot:left>
                        <p class="mt-4">
                            <span class="font-bold">Nombre ayant eu</span>
                        </p>
                    </template>
                </IndicateursRow>

                <template
                    v-for="(section, index) in sections"
                    :key="section.id"
                >
                    <IndicateursRow
                        v-if="
                            index > 0 &&
                            section.topic !== sections[index - 1].topic
                        "
                    >
                        <template v-slot:left>&nbsp;</template>
                    </IndicateursRow>

                    <component
                        :is="section.component"
                        :data="focusedYearData"
                        :errors="focusedYearErrors"
                    />
                </template>
            </template>
        </IndicateursGrid>

        <InputIndicateursScolaires
            class="mt-12"
            v-if="topics?.includes && topics.includes('school')"
            :data="focusedYearData"
            :year="focusedYear"
            :errors="focusedYearErrors"
        />
    </div>
</template>

<script setup>
import { defineProps, toRefs, watch, ref, computed } from "vue";
import { useField, useFormErrors } from "vee-validate";
import { Button } from "@resorptionbidonvilles/ui";
import sectionsList from "./sections.list";
import inputsList from "./inputs.list";

import IndicateursGrid from "@/components/IndicateursGrid/IndicateursGrid.vue";
import IndicateursRow from "@/components/IndicateursTable/IndicateursRow.vue";
import InputIndicateursPersonnes from "./InputIndicateursPersonnes.vue";
import InputIndicateursScolaires from "./InputIndicateursScolaires.vue";

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    minYear: {
        type: Number,
        required: true,
    },
    maxYear: {
        type: Number,
        required: true,
    },
    topics: {
        type: Array,
        default() {
            return [];
        },
    },
});

const { name, minYear, maxYear, topics } = toRefs(props);

const { value } = useField(name.value);
initializeYears(value.value);

const errors = useFormErrors();

const focusedYear = ref(Math.min(new Date().getFullYear(), maxYear.value));
const focusedYearData = computed(() => {
    return value.value?.[focusedYear.value] || {};
});
const focusedYearErrors = computed(() => {
    return (
        Object.keys(errors.value)
            // l'erreur peut-être sous deux formats différents selon que c'est Yup ou l'API qui a
            // généré l'erreur
            // - yup: indicateurs.2023.nombre_personnes
            // - api : indicateurs[2023].nombre_personnes
            .filter((key) =>
                new RegExp(
                    `indicateurs(\\[|\\.)${focusedYear.value}(\\]|\\.)`
                ).test(key)
            )
            .reduce((acc, key) => {
                const fieldName = key.match(
                    /^indicateurs(?:\[|\.).+\]?\.(.+)$/
                )[1];
                acc[fieldName] = [errors.value[key]];
                return acc;
            }, {})
    );
});
const sections = computed(() => {
    return sectionsList.filter(
        ({ topic }) =>
            topics.value?.includes &&
            topics.value.includes(topic) &&
            topic !== "school"
    );
});

function setYear(year) {
    focusedYear.value = year;
}
function previousYear() {
    setYear(Math.max(minYear.value || 0, focusedYear.value - 1));
}
function nextYear() {
    setYear(Math.min(maxYear.value, focusedYear.value + 1));
}
function initializeYears(obj) {
    let year = minYear.value;
    do {
        if (obj[year] === undefined) {
            obj[year] = {};
        }
    } while (++year <= Math.min(maxYear.value, new Date().getFullYear()));

    return obj;
}

function applyNewTimeRange() {
    if (!value.value) {
        return;
    }

    // on supprime les données des années en-dehors de l'intervalle autorisé
    Object.keys(value.value).forEach((strYear) => {
        const year = parseInt(strYear, 10);
        if (year < minYear.value || year > maxYear.value) {
            delete value.value[strYear];
            value.value[strYear] = undefined;
        }
    });

    // on initialise l'objet pour les éventuelles années qui ont été rajoutées à l'intervalle autorisé
    initializeYears(value.value);

    if (minYear.value && focusedYear.value < minYear.value) {
        focusedYear.value = minYear.value;
    }

    if (maxYear.value && focusedYear.value > maxYear.value) {
        focusedYear.value = maxYear.value;
    }
}

function applyNewTopics() {
    if (!value.value) {
        return;
    }

    Object.keys(value.value).forEach((year) => {
        topics.value.forEach((topic) => {
            if (
                !inputsList[topic] ||
                inputsList[topic].some(
                    ({ id }) => value.value[year][id] !== undefined
                )
            ) {
                return;
            }

            // @todo 1784 : rétablir les initial values
        });

        if (value.value[year]) {
            sectionsList.forEach((section) => {
                if (!topics.value.includes(section.topic)) {
                    inputsList[section.topic].forEach(({ id }) => {
                        delete value.value[year][id];
                        value.value[year][id] = undefined;
                    });
                }
            });
        }
    });
}

watch(minYear, applyNewTimeRange);
watch(maxYear, applyNewTimeRange);
watch(topics, applyNewTopics);
</script>
