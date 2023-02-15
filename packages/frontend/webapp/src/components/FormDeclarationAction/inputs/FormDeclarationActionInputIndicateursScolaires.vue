<template>
    <IndicateursGrid class="mt-12">
        <IndicateursRow>
            <template v-slot:right>
                <p class="px-4 pb-2">
                    <span class="font-bold"
                        >Année scolaire {{ year - 1 }} - {{ year }}</span
                    ><br />(à remplir en juin {{ year }})
                </p>
            </template>
        </IndicateursRow>

        <IndicateursTableRowInputs
            :icon="icons.ecole"
            :inputs="schoolInputs.mineurs_scolarisables"
        >
            <IndicateursLabelMineursScolarisables />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :inputs="schoolInputs.mineurs_en_mediation"
            withoutTopBorder
        >
            <IndicateursLabelMineursEnMediation />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :inputs="schoolInputs.maternelle"
            withoutTopBorder
        >
            <IndicateursLabelMaternelle />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :inputs="schoolInputs.elementaire"
            withoutPadding
            withoutTopBorder
        >
            <IndicateursLabelElementaire />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :inputs="schoolInputs.college"
            withoutPadding
            withoutTopBorder
        >
            <IndicateursLabelCollege />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :inputs="schoolInputs.lycee"
            withoutPadding
            withoutTopBorder
        >
            <IndicateursLabelLycee />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :inputs="schoolInputs.autre"
            withoutPadding
            withoutTopBorder
        >
            <IndicateursLabelAutres />
        </IndicateursTableRowInputs>
    </IndicateursGrid>
</template>

<script setup>
import { computed } from "vue";
import icons from "@/utils/action_metrics_icons";
import { useFormValues } from "vee-validate";

import IndicateursRow from "@/components/IndicateursTable/IndicateursRow.vue";
import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";

import IndicateursGrid from "@/components/IndicateursGrid/IndicateursGrid.vue";
import IndicateursLabelAutres from "@/components/IndicateursLabel/IndicateursLabelAutres.vue";
import IndicateursLabelCollege from "@/components/IndicateursLabel/IndicateursLabelCollege.vue";
import IndicateursLabelElementaire from "@/components/IndicateursLabel/IndicateursLabelElementaire.vue";
import IndicateursLabelLycee from "@/components/IndicateursLabel/IndicateursLabelLycee.vue";
import IndicateursLabelMaternelle from "@/components/IndicateursLabel/IndicateursLabelMaternelle.vue";
import IndicateursLabelMineursEnMediation from "@/components/IndicateursLabel/IndicateursLabelMineursEnMediation.vue";
import IndicateursLabelMineursScolarisables from "@/components/IndicateursLabel/IndicateursLabelMineursScolarisables.vue";

const schoolInputs = {
    mineurs_scolarisables: [{ name: "scolaire_mineurs_scolarisables" }],
    mineurs_en_mediation: [{ name: "scolaire_mineurs_en_mediation" }],
    maternelle: [{ name: "scolaire_nombre_maternelle" }],
    elementaire: [{ name: "scolaire_nombre_elementaire" }],
    college: [{ name: "scolaire_nombre_college" }],
    lycee: [{ name: "scolaire_nombre_lycee" }],
    autre: [{ name: "scolaire_nombre_autre" }],
};
const values = useFormValues();

const year = computed(() => {
    if (!values.value.started_at) {
        return 2023;
    } else {
        const now = new Date(values.value.started_at);
        return now.getFullYear() === 2023 ? 2023 : 2022;
    }
});
</script>
