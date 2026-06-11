<template>
    <IndicateursTableRowData
        :icon="icons.ecole"
        :labels="['Moins de 3 ans', '3 ans et plus']"
        :data="data.mineurs_identifies"
    >
        <IndicateursLabel>Mineurs identifiés sur site</IndicateursLabel>
    </IndicateursTableRowData>

    <IndicateursTableRowData
        :labels="['Moins de 3 ans', '3 ans et plus']"
        :data="data.mineurs_mediation"
    >
        <IndicateursLabel>
            Mineurs bénéficiant d'une
            <span class="text-tertiaryA11Y">action de médiation</span>
        </IndicateursLabel>
    </IndicateursTableRowData>

    <IndicateursTableRowData :labels="['']" :data="data.scolarises_dans_annee">
        <IndicateursLabel>
            Mineurs nouvellement scolarisés depuis
            <span class="text-tertiaryA11Y">la rentrée scolaire</span>
        </IndicateursLabel>
    </IndicateursTableRowData>

    <IndicateursTableRowData
        :labels="[
            `<span class='text-tertiaryA11Y'>En maternelle</span>`,
            `<span class='text-tertiaryA11Y'>En élémentaire</span>`,
            `<span class='text-tertiaryA11Y'>Au collège</span>`,
            `<span class='text-tertiaryA11Y'>Au lycée ou en formation professionnelle</span>`,
            `<span class='font-bold'>Tous niveaux scolaires confondus (3-18 ans)</span>`,
        ]"
        :data="scolarisesAvecTotal"
    >
        <IndicateursLabel>Total des mineur scolarisés</IndicateursLabel>
    </IndicateursTableRowData>

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
import { defineProps, toRefs, computed } from "vue";
import icons from "@/utils/action_metrics_icons";

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

// Calcul du total pour chaque année
const scolarisesAvecTotal = computed(() => {
    return data.value.scolarises.map((yearData) => {
        if (!yearData || yearData.length < 4) {
            return yearData;
        }

        // Les 4 premières catégories sont maintenant dans le bon ordre
        // Le total est déjà calculé par le backend à la position 4
        const total = yearData
            .slice(0, 4)
            .reduce((sum, val) => sum + (val || 0), 0);
        return [...yearData.slice(0, 4), total];
    });
});
</script>
