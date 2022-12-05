<template>
    <SubQuestionWrapper
        label="Est-ce qu’un diagnostic prévention incendie par le SDIS (Service départemental d'incendie et de secours) a été réalisé ?"
    >
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_firePrevention_diagnostic"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_firePrevention_diagnostic"
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
