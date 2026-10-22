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
import { toRefs, watch, ref, computed, nextTick } from "vue";
import { useField } from "vee-validate";
import { Button } from "@resorptionbidonvilles/ui";
import {
    formatIndicateursYearError,
    pickYearToDisplay,
} from "@/utils/parseIndicateursErrors";
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
        required: false,
        default() {
            return [];
        },
    },
    errors: {
        type: Object,
        required: false,
        default() {
            return {};
        },
    },
});

const { name, minYear, maxYear, topics, errors } = toRefs(props);

const { value } = useField(name.value);
initializeYears(value.value);

const focusedYear = ref(Math.min(new Date().getFullYear(), maxYear.value));
const focusedYearData = computed(() => {
    return value.value?.[focusedYear.value] || {};
});

// errors est un objet { année: { fieldName: message } } reconstruit par le
// parent depuis les erreurs yup (messages encodés "FIELD:fieldName|MESSAGE:...").
// Seules les erreurs de l'année affichée sont transmises aux champs, avec le
// libellé de l'année en préfixe.
const focusedYearErrors = computed(() => {
    const yearErrors = errors.value?.[focusedYear.value];
    if (!yearErrors || Object.keys(yearErrors).length === 0) {
        return {};
    }
    return Object.keys(yearErrors).reduce((acc, fieldName) => {
        acc[fieldName] = [
            formatIndicateursYearError(
                focusedYear.value,
                fieldName,
                yearErrors[fieldName]
            ),
        ];
        return acc;
    }, {});
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
// Affiche l'année demandée si elle est dans la plage navigable, puis attend
// le rendu pour que les champs en erreur de cette année soient dans le DOM.
async function showYear(year) {
    if (year >= minYear.value && year <= maxYear.value) {
        setYear(year);
    }
    await nextTick();
}
// Après une soumission rejetée : garde l'année affichée si elle est en erreur,
// sinon bascule sur la plus ancienne année en erreur.
async function showFirstYearInError(yearsInError) {
    const year = pickYearToDisplay(
        yearsInError,
        focusedYear.value,
        minYear.value,
        maxYear.value
    );
    if (year !== null) {
        await showYear(year);
    }
    return year;
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
        const year = Number.parseInt(strYear, 10);
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

defineExpose({ showYear, showFirstYearInError });
</script>
