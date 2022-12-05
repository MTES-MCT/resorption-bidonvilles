<template>
    <SubQuestionWrapper label="L'eau est-elle potable ?">
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_water_potable"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_water_potable"
                :value="false"
                disabled
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
</script>
