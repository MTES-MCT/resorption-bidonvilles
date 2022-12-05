<template>
    <SubQuestionWrapper
        label="L'accès nécessite-t-il un franchissement de rue ou de route ?"
    >
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_water_roadsToCross"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_water_roadsToCross"
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
