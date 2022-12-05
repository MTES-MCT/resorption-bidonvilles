<template>
    <SubQuestionWrapper
        label="Est-ce un point d'eau public ? (robinet, fontaine publique...)"
    >
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_water_publicPoint"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_water_publicPoint"
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
