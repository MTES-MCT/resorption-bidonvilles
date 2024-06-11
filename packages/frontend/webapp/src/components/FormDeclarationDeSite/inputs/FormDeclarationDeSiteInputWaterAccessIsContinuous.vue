<template>
    <SubQuestionWrapper
        :label="labels.water_access_is_continuous"
        info="C'est-à-dire qu'il ne varie pas en qualité et en quantité dans la journée et les saisons, sans limite dans le temps."
    >
        <CheckableGroup
            id="water_access_is_continuous"
            direction="horizontal"
            withoutMargin
        >
            <Radio
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :label="item.label"
                name="water_access_is_continuous"
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
