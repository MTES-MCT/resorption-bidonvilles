<template>
    <SubQuestionWrapper
        label="Est-ce que des dispositifs spécifiques (formation, extincteurs...) ont été mis en place ?"
    >
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_firePrevention_devices"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_firePrevention_devices"
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
