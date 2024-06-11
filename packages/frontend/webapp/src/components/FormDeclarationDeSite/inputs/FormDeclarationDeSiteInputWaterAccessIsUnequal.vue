<template>
    <SubQuestionWrapper
        :label="labels.water_access_is_unequal"
        info="Il est recommandé 1 robinet pour 50 personnes. Cette recommandation doit être adaptée aux spécificités du site."
    >
        <CheckableGroup
            id="water_access_is_unequal"
            direction="horizontal"
            withoutMargin
        >
            <Radio
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :label="item.label"
                name="water_access_is_unequal"
                v-bind="$attrs"
                variant="radio"
                allowNull
                :nullValue="-1"
                class="ml-3"
            />
        </CheckableGroup>
    </SubQuestionWrapper>
</template>

<script setup>
import {
    CheckableGroup,
    Radio,
    SubQuestionWrapper,
} from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";

const items = [
    { value: 1, label: "Oui" },
    { value: 0, label: "Non" },
];
</script>
