<template>
    <SubQuestionWrapper :label="labels.trash_bulky_is_piling">
        <CheckableGroup
            id="trash_bulky_is_piling"
            direction="horizontal"
            withoutMargin
        >
            <Radio
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :label="item.label"
                name="trash_bulky_is_piling"
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
