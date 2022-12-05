<template>
    <SubQuestionWrapper
        label="Constate-t-on des marques de défécation à l'air libre ?"
    >
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_sanitary_insalubrious"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_sanitary_insalubrious"
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
