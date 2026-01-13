<template>
    <IndicateursTableRow :icon="icons.ecole">
        <template v-slot:label>
            <IndicateursLabel>Mineurs identifiés sur site</IndicateursLabel>
        </template>
    </IndicateursTableRow>

    <IndicateursTableRowData
        :labels="['Moins de 3 ans', '3 ans et plus']"
        :data="data.mineurs_identifies"
        :labels-without-background="[0, 1]"
        withoutTopBorder
    />

    <IndicateursTableRow>
        <template v-slot:label>
            <IndicateursLabel>
                Mineurs bénéficiant d'une
                <span class="text-tertiaryA11Y">action de médiation</span>
            </IndicateursLabel>
        </template>
    </IndicateursTableRow>

    <IndicateursTableRowData
        :labels="['Moins de 3 ans', '3 ans et plus']"
        :data="data.mineurs_mediation"
        :labels-without-background="[0, 1]"
        withoutTopBorder
    />

    <IndicateursTableRowData
        :labels="[
            `<span>Mineurs nouvellement scolarisés depuis <span class='text-tertiaryA11Y'>la rentrée scolaire</span></span>`,
        ]"
        :data="data.scolarises_dans_annee"
        :labels-without-background="[0]"
        withoutTopBorder
    />

    <IndicateursTableRow>
        <template v-slot:label>
            <IndicateursLabel>Total des mineurs scolarisés</IndicateursLabel>
        </template>
    </IndicateursTableRow>

    <IndicateursTableRowData
        :labels="[
            'Tous niveaux scolaires confondus (3-18 ans)',
            `<span class='text-tertiaryA11Y'>En maternelle</span>`,
            `<span class='text-tertiaryA11Y'>En élémentaire</span>`,
            `<span class='text-tertiaryA11Y'>Au collège</span>`,
            `<span class='text-tertiaryA11Y'>Au lycée ou en formation professionnelle</span>`,
        ]"
        :data="data.scolarises"
        :labels-without-background="[0, 1, 2, 3, 4]"
        withoutTopBorder
    />

    <IndicateursTableRowData
        :labels="['']"
        :data="data.autre"
        withoutTopBorder
        withoutPadding
    >
        <IndicateursLabelAutres />
    </IndicateursTableRowData>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import icons from "@/utils/action_metrics_icons";

import IndicateursTableRow from "@/components/IndicateursTable/IndicateursTableRow.vue";
import IndicateursTableRowData from "@/components/IndicateursTable/IndicateursTableRowData.vue";
import IndicateursLabel from "@/components/IndicateursLabel/IndicateursLabel.vue";
import IndicateursLabelAutres from "@/components/IndicateursLabel/IndicateursLabelAutres.vue";

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
});
const { data } = toRefs(props);
</script>
