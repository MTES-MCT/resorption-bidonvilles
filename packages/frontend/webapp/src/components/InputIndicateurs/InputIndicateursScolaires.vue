<template>
    <IndicateursGrid class="mt-12">
        <IndicateursRow>
            <template v-slot:right>
                <p class="px-4 pb-2">
                    <span class="font-bold"
                        >Année scolaire {{ year - 1 }} - {{ year }}</span
                    ><br />
                </p>
            </template>
        </IndicateursRow>

        <!-- Mineurs identifiés sur site -->
        <IndicateursTableRow :icon="icons.ecole">
            <template v-slot:label>
                <IndicateursLabel>Mineurs identifiés sur site</IndicateursLabel>
            </template>
        </IndicateursTableRow>

        <IndicateursTableRowDataInputs
            :labels="['Moins de 3 ans', '3 ans et plus']"
            :fields="[
                'scolaire_mineurs_moins_de_trois_ans',
                'scolaire_mineurs_trois_ans_et_plus',
            ]"
            :data="data"
            :errors="errors"
            :labels-without-background="[0, 1]"
            withoutTopBorder
        />

        <!-- Mineurs bénéficiant d'une médiation -->
        <IndicateursTableRow>
            <template v-slot:label>
                <IndicateursLabel>
                    Mineurs bénéficiant d'une
                    <span class="text-tertiaryA11Y">action de médiation</span>
                </IndicateursLabel>
            </template>
        </IndicateursTableRow>

        <IndicateursTableRowDataInputs
            :labels="['Moins de 3 ans', '3 ans et plus']"
            :fields="[
                'scolaire_mediation_moins_de_trois_ans',
                'scolaire_mediation_trois_ans_et_plus',
            ]"
            :data="data"
            :errors="errors"
            :labels-without-background="[0, 1]"
            withoutTopBorder
        />

        <IndicateursTableRow>
            <template v-slot:label>
                <IndicateursLabel>
                    Mineurs dont la scolarité a débuté
                    <span class="text-tertiaryA11Y">cette année scolaire</span>
                </IndicateursLabel>
            </template>

            <template v-slot:right>
                <div class="grid grid-cols-1 flex-1 w-full">
                    <div class="flex items-center px-4 min-h-20 bg-G200 w-full">
                        <TextInputUi
                            name="scolaire_mineur_scolarise_dans_annee"
                            v-model="data.scolaire_mineur_scolarise_dans_annee"
                            withoutMargin
                            variant="minimal"
                            size="sm"
                            :inlineError="true"
                            :errors="
                                errors.scolaire_mineur_scolarise_dans_annee ||
                                []
                            "
                        />
                    </div>
                </div>
            </template>
        </IndicateursTableRow>

        <IndicateursTableRow>
            <template v-slot:label>
                <IndicateursLabel>
                    Total des mineurs scolarisés
                </IndicateursLabel>
            </template>
        </IndicateursTableRow>
        <IndicateursTableRowDataInputs
            :labels="totalLabels"
            :fields="totalFields"
            :readonly-values="totalReadonlyValues"
            :data="data"
            :errors="errors"
            :labels-without-background="[0, 1, 2, 3, 4]"
            withoutTopBorder
        />

        <IndicateursTableRowDataInputs
            :labels="['']"
            :fields="['scolaire_nombre_autre']"
            :data="data"
            :errors="errors"
            withoutTopBorder
            withoutPadding
        >
            <IndicateursLabelAutres />
        </IndicateursTableRowDataInputs>
    </IndicateursGrid>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import icons from "@/utils/action_metrics_icons";

import IndicateursRow from "@/components/IndicateursTable/IndicateursRow.vue";
import IndicateursTableRowDataInputs from "@/components/IndicateursTable/IndicateursTableRowDataInputs.vue";
import IndicateursTableRow from "@/components/IndicateursTable/IndicateursTableRow.vue";
import IndicateursLabel from "@/components/IndicateursLabel/IndicateursLabel.vue";

import { TextInputUi } from "@resorptionbidonvilles/ui";
import IndicateursGrid from "@/components/IndicateursGrid/IndicateursGrid.vue";
import IndicateursLabelAutres from "@/components/IndicateursLabel/IndicateursLabelAutres.vue";
const props = defineProps({
    year: {
        type: Number,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    errors: {
        type: Object,
        default: () => ({}),
    },
});
const { data, year, errors } = toRefs(props);

const totalLabels = [
    `<span class='text-tertiaryA11Y'>En maternelle</span>`,
    `<span class='text-tertiaryA11Y'>En élémentaire</span>`,
    `<span class='text-tertiaryA11Y'>Au collège</span>`,
    `<span class='text-tertiaryA11Y'>Au lycée ou en formation professionnelle</span>`,
    `<span class='font-bold'>Tous niveaux scolaires confondus (3-18 ans)</span>`,
];

const totalFields = [
    "scolaire_nombre_maternelle",
    "scolaire_nombre_elementaire",
    "scolaire_nombre_college",
    "scolaire_nombre_lycee",
    null,
];

const totalReadonlyValues = computed(() => {
    const sum = [
        data.value.scolaire_nombre_maternelle,
        data.value.scolaire_nombre_elementaire,
        data.value.scolaire_nombre_college,
        data.value.scolaire_nombre_lycee,
    ].reduce((acc, value) => acc + (Number(value) || 0), 0);

    return [null, null, null, null, Number.isFinite(sum) ? sum : 0];
});
</script>
