<template>
    <SubQuestionWrapper
        label="Tous les habitants ont-ils accès aux points d'eau ?"
    >
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_water_everyoneHasAccess"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_water_everyoneHasAccess"
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
