<template>
    <SubQuestionWrapper :label="labels.electricity_access_is_unequal">
        <CheckableGroup
            id="electricity_access_is_unequal"
            direction="horizontal"
            withoutMargin
        >
            <Radio
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :label="item.label"
                name="electricity_access_is_unequal"
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
