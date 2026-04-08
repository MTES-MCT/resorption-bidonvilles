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
import { useField } from "vee-validate";
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

const focusedYearErrors = computed(() => {
    const errorsObj = errors.value;
    if (!errorsObj || Object.keys(errorsObj).length === 0) {
        return {};
    }

    console.log("Errors object:", errorsObj);

    // Accumuler toutes les erreurs au lieu de retourner immédiatement
    const allErrors = {};

    // Cas spécial : si l'erreur est stockée sous "indicateurs" (validation yup.when ou typeError)
    // on doit extraire le fieldName depuis le format structuré "FIELD:fieldName|MESSAGE:message"
    if (errorsObj.indicateurs && typeof errorsObj.indicateurs === "string") {
        const { fieldName, userMessage } = parseStructuredError(
            errorsObj.indicateurs
        );
        if (fieldName) {
            allErrors[fieldName] = [userMessage];
        }
    }

    // Traiter les erreurs avec clés structurées (ex: "indicateurs[2024].nombre_personnes")
    const filtered = Object.keys(errorsObj).filter((key) => {
        const regex = new RegExp(
            String.raw`indicateurs(\[|\.)${focusedYear.value}(\]|\.)`
        );
        return regex.test(key);
    });

    filtered.forEach((key) => {
        // Regex sécurisée : évite le backtracking catastrophique
        // Supporte deux formats : "indicateurs[2024].nombre_personnes" OU "indicateurs.2024.nombre_personnes"
        // Utilise une alternation explicite au lieu de .*? pour éviter le backtracking
        const match = key.match(
            /^indicateurs(?:\[([^\]]+)\]|\.([^.]+))\.(.+)$/
        );

        if (match) {
            // match[1] = année (format crochet) OU match[2] = année (format point)
            // match[3] = nom du champ
            const fieldName = match[3];
            const errorMessage = errorsObj[key];

            // Parser le message pour extraire uniquement la partie utilisateur
            if (typeof errorMessage === "string") {
                const { userMessage } = parseStructuredError(errorMessage);
                allErrors[fieldName] = [userMessage || errorMessage];
            } else {
                allErrors[fieldName] = [errorMessage];
            }
        }
    });

    return allErrors;
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

/**
 * Extrait le nom du champ et le message utilisateur depuis le format structuré.
 * Format attendu: "FIELD:fieldName|MESSAGE:message"
 * @param {string} errorMessage - Le message d'erreur au format structuré
 * @returns {{ fieldName: string|null, userMessage: string }} - Le nom du champ et le message pour l'utilisateur
 */
function parseStructuredError(errorMessage) {
    if (!errorMessage) {
        return { fieldName: null, userMessage: "" };
    }

    // Parser le format "FIELD:fieldName|MESSAGE:message"
    const match = errorMessage.match(/^FIELD:([^|]+)\|MESSAGE:(.+)$/);

    if (match) {
        return {
            fieldName: match[1],
            userMessage: match[2],
        };
    }

    // Fallback : si le format n'est pas reconnu, retourner le message tel quel
    return {
        fieldName: null,
        userMessage: errorMessage,
    };
}
</script>
